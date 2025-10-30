package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.CommentCreateDTO;
import com.uet.VolunteerHub.dto.CommentReadDTO;
import com.uet.VolunteerHub.dto.CommentUpdateContentDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Comment;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.mapper.CommentMapper;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.CommentRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import com.uet.VolunteerHub.repository.specification.CommentSpecification;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log
@AllArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final CommentSpecification commentSpecification;
    private final PostRepository postRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public Page<CommentReadDTO> findAllByPost(Long postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByPost_PostId(postId, pageable);
        return comments.map(commentMapper::toCommentReadDTO);
    }

    @Transactional(readOnly = true)
    public Page<CommentReadDTO> getRepliesForComment(Long parentCommentId, Pageable pageable) {
        Page<Comment> replies = commentRepository.findByParentComment_CommentId(parentCommentId, pageable);
        return replies.map(commentMapper::toCommentReadDTO);
    }

    @Transactional(readOnly = true)
    public Page<CommentReadDTO> searchComments(Long postId, boolean rootOnly, Pageable pageable) {
        Specification<Comment> spec = Specification
                .where(commentSpecification.commentsOfPost(postId));
        if (rootOnly) {
            spec = spec.and(commentSpecification.nonParentComment());
        }
        Page<Comment> comments = commentRepository.findAll(spec, pageable);
        return comments.map(commentMapper::toCommentReadDTO);
    }

    @Transactional
    public CommentReadDTO createComment(CommentCreateDTO dto) {
        Comment comment = commentMapper.toCommentEntity(dto);
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + dto.getPostId()));
        Account account = accountRepository.findById(dto.getCreatedByAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + dto.getCreatedByAccountId()));
        comment.setPost(post);
        comment.setCreatedByAccount(account);
        if (dto.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(dto.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + dto.getParentCommentId()));
            comment.setParentComment(parentComment);
        }
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentReadDTO(savedComment);
    }

    @Transactional
    public CommentReadDTO updateCommentContent(Long commentId, CommentUpdateContentDTO dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        comment.setContent(dto.getContent());
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentReadDTO(savedComment);
    }

    @Transactional
    public boolean deleteComment(Long commentId) {
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
            return true;
        }
        return false;
    }

}
