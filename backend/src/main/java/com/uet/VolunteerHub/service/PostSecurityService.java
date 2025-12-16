package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("postSecurityService")
public class PostSecurityService {
    private final PostRepository postRepository;
    private final EventUserRepository eventUserRepository;

    @Autowired
    public PostSecurityService(PostRepository postRepository, EventUserRepository eventUserRepository) {
        this.postRepository = postRepository;
        this.eventUserRepository = eventUserRepository;
    }

    public boolean canModifyPost(Long postId) {
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

        // Check if user is the owner of the post
        if (post.getCreatedByAccount().getAccountId().equals(account.getAccountId())) {
            return true;
        }

        if (post.getEvent() == null) {
            return false;
        }
        Long eventId = post.getEvent().getEventId();
        return isEventManager(account.getAccountId(), eventId);
    }

    public boolean canCreatePost(Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (eventId == null) {
            return false;
        }
        return isEventManager(account.getAccountId(), eventId);
    }

    private boolean isEventManager(java.util.UUID accountId, Long eventId) {
        Optional<EventUser> eventUserOptional = eventUserRepository.findByAccountIdAndEventId(
                accountId,
                eventId
        );
        if (eventUserOptional.isEmpty()) {
            return false;
        }
        EventUser eventUser = eventUserOptional.get();
        return eventUser.getRole().equals(EventUserRole.MANAGER);
    }
}
