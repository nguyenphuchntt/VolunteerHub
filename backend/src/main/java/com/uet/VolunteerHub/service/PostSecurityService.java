package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("postSecurityService")
public class PostSecurityService {
    private final PostReadService postReadService;

    @Autowired
    public PostSecurityService(PostReadService postReadService) {
        this.postReadService = postReadService;
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
}
