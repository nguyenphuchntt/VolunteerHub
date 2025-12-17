package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.*;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.repository.CommentRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("commentSecurityService")
public class CommentSecurityService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final EventUserRepository eventUserRepository;

    @Autowired
    public CommentSecurityService(CommentRepository commentRepository, PostRepository postRepository, EventUserRepository eventUserRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.eventUserRepository = eventUserRepository;
    }

    public boolean canCreateComment(Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (postId == null) {
            return false;
        }
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            return false;
        }
        Post post = postOptional.get();
        if (post.getEvent() == null) {
            return false;
        }
        Long eventId = post.getEvent().getEventId();

        // Check if user is an approved member or manager of the event
        Optional<EventUser> eventUserOptional = eventUserRepository.findByAccountIdAndEventId(
                account.getAccountId(),
                eventId
        );
        if (eventUserOptional.isEmpty()) {
            return false;
        }
        EventUser eventUser = eventUserOptional.get();
        return eventUser.getStatus() == EventUserStatus.APPROVED;
    }

    public boolean canModifyComment(Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (commentId == null) {
            return false;
        }
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty()) {
            return false;
        }
        Comment comment = commentOptional.get();

        // Check if user is the owner of the comment
        return comment.getCreatedByAccount().getAccountId().equals(account.getAccountId());
    }

    public boolean canDeleteComment(Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (commentId == null) {
            return false;
        }
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty()) {
            return false;
        }
        Comment comment = commentOptional.get();

        // 1. Owner of the comment
        if (comment.getCreatedByAccount().getAccountId().equals(account.getAccountId())) {
            return true;
        }

        // 2. Manager of the event
        if (comment.getPost() != null && comment.getPost().getEvent() != null) {
            Long eventId = comment.getPost().getEvent().getEventId();
            Optional<EventUser> eventUserOptional = eventUserRepository.findByAccountIdAndEventId(
                    account.getAccountId(),
                    eventId
            );
            if (eventUserOptional.isPresent()) {
                return eventUserOptional.get().getRole() == EventUserRole.MANAGER;
            }
        }

        return false;
    }
}
