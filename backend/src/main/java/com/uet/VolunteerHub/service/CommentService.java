package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Post.CommentCreateDTO;
import com.uet.VolunteerHub.dto.Post.CommentReadDTO;
import com.uet.VolunteerHub.dto.Post.CommentUpdateContentDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Comment;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
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

    // Helper to map comment and add replyCount
    private CommentReadDTO mapWithReplyCount(Comment comment) {
        CommentReadDTO dto = commentMapper.toCommentReadDTO(comment);
        Long replyCount = commentRepository.countByParentComment_CommentId(comment.getCommentId());
        dto.setReplyCount(replyCount != null ? replyCount : 0L);
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<CommentReadDTO> findAllByPost(Long postId, Pageable pageable) {
        // Only return root comments (no parent), replies are fetched separately via getRepliesForComment
        Page<Comment> comments = commentRepository.findByPost_PostIdAndParentCommentIsNull(postId, pageable);
        return comments.map(this::mapWithReplyCount);
    }

    @Transactional(readOnly = true)
    public Page<CommentReadDTO> getRepliesForComment(Long parentCommentId, Pageable pageable) {
        Page<Comment> replies = commentRepository.findByParentComment_CommentId(parentCommentId, pageable);
        return replies.map(this::mapWithReplyCount);
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
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + dto.getPostId()));
        Account account = accountRepository.findById(dto.getCreatedByAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + dto.getCreatedByAccountId()));
        comment.setPost(post);
        comment.setCreatedByAccount(account);
        if (dto.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(dto.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found with id: " + dto.getParentCommentId()));
            comment.setParentComment(parentComment);
        }
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentReadDTO(savedComment);
    }

    @Transactional
    public CommentReadDTO updateCommentContent(Long commentId, CommentUpdateContentDTO dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        comment.setContent(dto.getContent());
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentReadDTO(savedComment);
    }

    @Transactional(readOnly = true)
    public Long countCommentsByPost(Long postId) {
        return commentRepository.countByPost_PostId(postId);
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
