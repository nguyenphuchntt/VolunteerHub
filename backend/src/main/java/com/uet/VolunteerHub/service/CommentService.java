package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.CommentReadDTO;
import com.uet.VolunteerHub.entity.Comment;
import com.uet.VolunteerHub.mapper.CommentMapper;
import com.uet.VolunteerHub.repository.CommentRepository;
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
}
