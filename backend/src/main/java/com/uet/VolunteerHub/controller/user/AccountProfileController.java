package com.uet.VolunteerHub.controller.user;

import com.uet.VolunteerHub.dto.Account.AccountPasswordChangeDTO;
import com.uet.VolunteerHub.dto.Account.AccountPasswordDTO;
import com.uet.VolunteerHub.dto.Account.UserProfileUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.dto.FollowUserDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.FollowUserService;
import com.uet.VolunteerHub.service.UserSearchService;
import com.uet.VolunteerHub.service.UserWriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for authenticated user's profile operations
 */
@RestController
@RequestMapping("/api/me/profile")
@PreAuthorize("isAuthenticated()")
public class AccountProfileController {

    private final UserSearchService userSearchService;
    private final UserWriteService userWriteService;
    private final FollowUserService followUserService;

    @Autowired
    public AccountProfileController(UserSearchService userSearchService,
                                    UserWriteService userWriteService, FollowUserService followUserService) {
        this.userSearchService = userSearchService;
        this.userWriteService = userWriteService;
        this.followUserService = followUserService;
    }

    /**
     * Get current user's profile
     * @param account authenticated account
     * @return user profile
     */
    @GetMapping
    public ResponseEntity<UserSearchDTO> getProfile(@AuthenticationPrincipal Account account) {
        return userSearchService.findUserById(account.getAccountId())
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update current user's profile
     * @param account authenticated account
     * @param userProfileUpdateDTO profile update data
     * @return updated profile
     */
    @PatchMapping("/update")
    public ResponseEntity<UserSearchDTO> updateProfile(@AuthenticationPrincipal Account account,
                                                       @RequestBody @Valid UserProfileUpdateDTO userProfileUpdateDTO) {
        return ResponseEntity.ok(userWriteService.updateUserProfile(userProfileUpdateDTO, account));
    }

    /**
     * Delete current user's profile
     * @param account authenticated account
     * @param accountPasswordDTO password confirmation
     * @return void
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal Account account,
                                              @RequestBody @Valid AccountPasswordDTO accountPasswordDTO) {
        userWriteService.deleteUser(account, accountPasswordDTO);
        return ResponseEntity.noContent().build();
    }

    /**
     * Change current user's password
     * @param account authenticated account
     * @param accountPasswordChangeDTO password change data
     * @return void
     */
    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal Account account,
                                               @RequestBody @Valid AccountPasswordChangeDTO accountPasswordChangeDTO) {
        userWriteService.changePasswordUser(account, accountPasswordChangeDTO);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers-count")
    public ResponseEntity<Long> getFollowersCount(@AuthenticationPrincipal Account account) {
        long count = followUserService.countFollowersByAccountId(account.getAccountId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/following-count")
    public ResponseEntity<Long> getFollowingCount(@AuthenticationPrincipal Account account) {
        long count = followUserService.countFollowingByAccountId(account.getAccountId());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/followers-list")
    public ResponseEntity<Page<FollowUserDTO>> getFollowersList(@AuthenticationPrincipal Account account,
                                                                @PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<FollowUserDTO> followers = followUserService.getFollowersByAccountId(account.getAccountId(), pageable);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/following-list")
    public ResponseEntity<Page<FollowUserDTO>> getFollowingList(@AuthenticationPrincipal Account account,
                                                                @PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<FollowUserDTO> following = followUserService.getFollowingByAccountId(account.getAccountId(), pageable);
        return ResponseEntity.ok(following);
    }

}
