package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.PostReadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for authenticated user's post operations
 */
@RestController
@RequestMapping("/api/me/posts")
@PreAuthorize("isAuthenticated()")
public class AccountPostController {

    private final PostReadService postReadService;

    @Autowired
    public AccountPostController(PostReadService postReadService) {
        this.postReadService = postReadService;
    }

    /**
     * Get posts liked by user
     * @param account authenticated account
     * @param pageable pagination
     * @return page of liked posts
     */
    @GetMapping("/liked")
    public ResponseEntity<Page<PostReadDTO>> getLikedPosts(@AuthenticationPrincipal Account account,
                                                           @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return ResponseEntity.ok(postReadService.getPostsLikedByAccount(account.getAccountId(), pageable));
    }
}
