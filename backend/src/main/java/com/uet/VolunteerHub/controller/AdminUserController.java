package com.uet.VolunteerHub.controller;

import java.util.UUID;

import com.uet.VolunteerHub.dto.Event.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.service.UserSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uet.VolunteerHub.dto.Account.AccountAdminCreateDTO;
import com.uet.VolunteerHub.dto.Account.AccountAdminPasswordChangeDTO;
import com.uet.VolunteerHub.dto.Account.AccountRoleUpdateDTO;
import com.uet.VolunteerHub.dto.Account.AccountStatusUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserProfileUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.service.UserWriteService;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserWriteService userWriteService;
    private final UserSearchService userSearchService;

    @Autowired
    public AdminUserController(UserWriteService userWriteService, UserSearchService userSearchService) {
        this.userWriteService = userWriteService;
        this.userSearchService = userSearchService;
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserSearchDTO> createAccount(@Valid @RequestBody AccountAdminCreateDTO accountAdminCreateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.createAccount(accountAdminCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userSearchDTO);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserSearchDTO> changeUserRole(@PathVariable("id") UUID id,
                                                        @RequestBody @Valid AccountRoleUpdateDTO accountRoleUpdateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.changeAccountRole(id, accountRoleUpdateDTO);
        return ResponseEntity.ok(userSearchDTO);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserSearchDTO> changeAccountStatus(@PathVariable("id") UUID id,
                                                             @RequestBody @Valid AccountStatusUpdateDTO accountStatusUpdateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.changeAccountStatus(id, accountStatusUpdateDTO);
        return ResponseEntity.ok(userSearchDTO);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") UUID id) {
        userWriteService.deleteAccountById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/change-password")
    public ResponseEntity<Void> changeUserPassword(@PathVariable("id") UUID id,
                                                   @RequestBody @Valid AccountAdminPasswordChangeDTO accountAdminPasswordChangeDTO) {
        userWriteService.changePasswordAdmin(id, accountAdminPasswordChangeDTO);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/update-details")
    public ResponseEntity<UserSearchDTO> changeUserDetails(@PathVariable("id") UUID id,
                                                            @RequestBody @Valid UserProfileUpdateDTO userProfileUpdateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.updateUserDetails(id, userProfileUpdateDTO);
        return ResponseEntity.ok(userSearchDTO);
    }

    @GetMapping("")
    public ResponseEntity<Page<UserSearchDTO>> getUsersByRole(
            @RequestParam(value = "role", required = false) String role,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserSearchDTO> users = userSearchService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

}
