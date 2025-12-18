package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Account.*;
import com.uet.VolunteerHub.dto.FollowUserDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.FollowUserService;
import com.uet.VolunteerHub.service.UserSearchService;
import com.uet.VolunteerHub.service.UserWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Log
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserSearchService userSearchService;
    private final UserWriteService userWriteService;
    private final FollowUserService followUserService;

    @Autowired
    public UserController(UserSearchService userSearchService,
                          UserWriteService userWriteService, FollowUserService followUserService) {
        this.userSearchService = userSearchService;
        this.userWriteService = userWriteService;
        this.followUserService = followUserService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserSearchDTO>> searchUsers(UserSearchCriteriaDTO criteria,
                                                           @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserSearchDTO> userSearchDTOPage = userSearchService.findUsersBySpecification(criteria, pageable);
        return ResponseEntity.ok(userSearchDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSearchDTO> searchUserById(@PathVariable("id") UUID id) {
        return userSearchService.findUserById(id)
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<UserSearchDTO> registerAccount(@Valid @RequestBody AccountUserRegisterDTO accountUserRegisterDTO) {
        UserSearchDTO userSearchDTO = userWriteService.registerAccount(accountUserRegisterDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userSearchDTO);
    }

    @GetMapping("/{id}/followers-count")
    public ResponseEntity<Long> getFollowersCount(@PathVariable("id") UUID accountId) {
        long count = followUserService.countFollowersByAccountId(accountId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}/following-count")
    public ResponseEntity<Long> getFollowingCount(@PathVariable("id") UUID followedByAccountId) {
        long count = followUserService.countFollowingByAccountId(followedByAccountId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}/followers-list")
    public ResponseEntity<Page<FollowUserDTO>> getFollowersList(@PathVariable("id") UUID accountId,
                                                               @PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<FollowUserDTO> followUserDTOPage = followUserService.getFollowersByAccountId(accountId, pageable);
        return ResponseEntity.ok(followUserDTOPage);
    }

    @GetMapping("/{id}/following-list")
    public ResponseEntity<Page<FollowUserDTO>> getFollowingList(@PathVariable("id") UUID followedByAccountId,
                                                               @PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<FollowUserDTO> followUserDTOPage = followUserService.getFollowingByAccountId(followedByAccountId, pageable);
        return ResponseEntity.ok(followUserDTOPage);
    }

    @GetMapping("/{id}/follow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FollowUserDTO> followUser(@PathVariable("id") UUID toBeFollowedAccountId,
                                                    @AuthenticationPrincipal Account account) {
        FollowUserDTO followUserDTO = followUserService.followUser(account, toBeFollowedAccountId);
        return ResponseEntity.status(HttpStatus.CREATED).body(followUserDTO);
    }

    @DeleteMapping("/{id}/unfollow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unfollowUser(@PathVariable("id") UUID toBeUnfollowedAccountId,
                                             @AuthenticationPrincipal Account account) {
        followUserService.unfollowUser(account, toBeUnfollowedAccountId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/is-following")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isFollowing(@PathVariable("id") UUID toBeCheckedAccountId,
                                               @AuthenticationPrincipal Account account) {
        boolean isFollowing = followUserService.isFollowing(account.getAccountId(), toBeCheckedAccountId);
        return ResponseEntity.ok(isFollowing);
    }

}
