package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log
@Service("postSecurityService")
public class PostSecurityService {
    private final PostReadService postReadService;
    private final PostRepository postRepository;
    private final EventUserRepository eventUserRepository;


    @Autowired
    public PostSecurityService(PostReadService postReadService,
                               PostRepository postRepository,
                               EventUserRepository eventUserRepository) {
        this.postReadService = postReadService;
        this.postRepository = postRepository;
        this.eventUserRepository = eventUserRepository;
    }

    public boolean isOwnerOfPost(Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null ||  !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (postId == null) {
            return false;
        }
        PostReadDTO post = postReadService.findPostById(postId);
        if (post == null) {
            return false;
        }
        return post.getOwnerUsername().equals(account.getUsername());
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


        if (post.getCreatedByAccount().getAccountId().equals(account.getAccountId())) {
            return true;
        }

        if (post.getEvent() == null) {
            return false;
        }
        Long eventId = post.getEvent().getEventId();
        return isEventAttendee(account.getAccountId(), eventId);
    }


    public boolean canCreatePost(Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            log.warning("canCreatePost: No authentication or invalid principal");
            return false;
        }
        if (eventId == null) {
            log.warning("canCreatePost: eventId is null");
            return false;
        }
        boolean result = isEventAttendee(account.getAccountId(), eventId);
        log.info("canCreatePost: accountId=" + account.getAccountId() + ", eventId=" + eventId + ", result=" + result);
        return result;
    }


    private boolean isEventAttendee(java.util.UUID accountId, Long eventId) {
        Optional<EventUser> eventUserOptional = eventUserRepository.findByAccountIdAndEventId(
                accountId,
                eventId
        );
        if (eventUserOptional.isEmpty()) {
            log.warning("isEventAttendee: No EventUser found for accountId=" + accountId + ", eventId=" + eventId);
            return false;
        }
        EventUser eventUser = eventUserOptional.get();
        boolean hasRole = eventUser.getRole().equals(EventUserRole.MANAGER) ||
               eventUser.getRole().equals(EventUserRole.ATTENDEE);
        log.info("isEventAttendee: found EventUser with role=" + eventUser.getRole() + ", status=" + eventUser.getStatus() + ", hasRole=" + hasRole);
        return hasRole;
    }
}


