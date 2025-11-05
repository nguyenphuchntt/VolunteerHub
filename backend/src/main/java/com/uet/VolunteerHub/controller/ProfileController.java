package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Account.AccountPasswordChangeDTO;
import com.uet.VolunteerHub.dto.Account.AccountPasswordDTO;
import com.uet.VolunteerHub.dto.Account.UserProfileUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.EventSearchService;
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


@RestController
@RequestMapping("/api/me")
@PreAuthorize("isAuthenticated()")
public class ProfileController {

    private final UserSearchService userSearchService;
    private final UserWriteService userWriteService;
    private final EventSearchService eventSearchService;

    @Autowired
    public ProfileController(UserSearchService userSearchService, UserWriteService userWriteService,
                             EventSearchService eventSearchService) {
        this.userSearchService = userSearchService;
        this.userWriteService = userWriteService;
        this.eventSearchService = eventSearchService;
    }

    @GetMapping
    public ResponseEntity<UserSearchDTO> getProfile(@AuthenticationPrincipal Account account) {
        return userSearchService.findUserById(account.getAccountId())
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/update")
    public ResponseEntity<UserSearchDTO> updateProfile(@AuthenticationPrincipal Account account,
                                                       @RequestBody @Valid UserProfileUpdateDTO userProfileUpdateDTO) {
        return ResponseEntity.ok(userWriteService.updateUserProfile(userProfileUpdateDTO, account));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal Account account,
                                              @RequestBody @Valid AccountPasswordDTO accountPasswordDTO) {
        userWriteService.deleteUser(account, accountPasswordDTO);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal Account account,
                                               @RequestBody @Valid AccountPasswordChangeDTO accountPasswordChangeDTO) {
        userWriteService.changePasswordUser(account, accountPasswordChangeDTO);
        return ResponseEntity.noContent().build();
    }

}
