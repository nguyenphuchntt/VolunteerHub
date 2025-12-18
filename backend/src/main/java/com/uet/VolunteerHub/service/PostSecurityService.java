package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.entity.EventUser;
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
            return false;
        }
        if (eventId == null) {
            return false;
        }
        return isEventAttendee(account.getAccountId(), eventId);
    }


    private boolean isEventAttendee(java.util.UUID accountId, Long eventId) {
        Optional<EventUser> eventUserOptional = eventUserRepository.findByAccountIdAndEventId(
                accountId,
                eventId
        );
        if (eventUserOptional.isEmpty()) {
            return false;
        }
        EventUser eventUser = eventUserOptional.get();
        return eventUser.getRole().equals(EventUserRole.MANAGER) ||
               eventUser.getRole().equals(EventUserRole.ATTENDEE);
    }
}


