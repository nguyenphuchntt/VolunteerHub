package com.uet.VolunteerHub.controller.user;

import java.util.UUID;

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

import com.uet.VolunteerHub.entity.Account;

/**
 * REST controller for admin user management operations
 */
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

    /**
     * Create a new user account (Admin only)
     * @param accountAdminCreateDTO account creation data
     * @return created user
     */
    @PostMapping("/create-user")
    public ResponseEntity<UserSearchDTO> createAccount(@Valid @RequestBody AccountAdminCreateDTO accountAdminCreateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.createAccount(accountAdminCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userSearchDTO);
    }

    /**
     * Change user role (prevents self-modification)
     * @param id user ID
     * @param accountRoleUpdateDTO new role
     * @return updated user
     */
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserSearchDTO> changeUserRole(@PathVariable("id") UUID id,
                                                        @RequestBody @Valid AccountRoleUpdateDTO accountRoleUpdateDTO) {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        Account caller = (auth != null && auth.getPrincipal() instanceof Account) 
            ? (Account) auth.getPrincipal() : null;
        boolean isSelf = caller != null && caller.getAccountId() != null && caller.getAccountId().equals(id);
        if (isSelf) {
            System.out.println(">>> BLOCKING: Admin trying to change own role!");
            throw new com.uet.VolunteerHub.exception.SelfRoleChangeException(
                "You cannot change your own account role. Please contact another admin.");
        }
        UserSearchDTO userSearchDTO = userWriteService.changeAccountRole(id, accountRoleUpdateDTO, caller);
        return ResponseEntity.ok(userSearchDTO);
    }

    /**
     * Change account status (prevents self-ban)
     * @param id user ID
     * @param accountStatusUpdateDTO new status
     * @return updated user
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserSearchDTO> changeAccountStatus(@PathVariable("id") UUID id,
                                                             @RequestBody @Valid AccountStatusUpdateDTO accountStatusUpdateDTO) {
        org.springframework.security.core.Authentication auth =
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        Account caller = (auth != null && auth.getPrincipal() instanceof Account) 
            ? (Account) auth.getPrincipal() : null;
        if (caller != null && caller.getAccountId() != null && caller.getAccountId().equals(id) 
                && accountStatusUpdateDTO.getStatus() == com.uet.VolunteerHub.enums.AccountStatus.BANNED) {
            throw new com.uet.VolunteerHub.exception.SelfRoleChangeException(
                "You cannot ban your own account. Please contact another admin.");
        }
        UserSearchDTO userSearchDTO = userWriteService.changeAccountStatus(id, accountStatusUpdateDTO, caller);
        return ResponseEntity.ok(userSearchDTO);
    }

    /**
     * Delete user account
     * @param id user ID
     * @return void
     */
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") UUID id) {
        userWriteService.deleteAccountById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Change user password (Admin only)
     * @param id user ID
     * @param accountAdminPasswordChangeDTO new password
     * @return void
     */
    @PatchMapping("/{id}/change-password")
    public ResponseEntity<Void> changeUserPassword(@PathVariable("id") UUID id,
                                                   @RequestBody @Valid AccountAdminPasswordChangeDTO accountAdminPasswordChangeDTO) {
        userWriteService.changePasswordAdmin(id, accountAdminPasswordChangeDTO);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update user profile details
     * @param id user ID
     * @param userProfileUpdateDTO updated profile data
     * @return updated user
     */
    @PatchMapping("/{id}/update-details")
    public ResponseEntity<UserSearchDTO> changeUserDetails(@PathVariable("id") UUID id,
                                                            @RequestBody @Valid UserProfileUpdateDTO userProfileUpdateDTO) {
        UserSearchDTO userSearchDTO = userWriteService.updateUserDetails(id, userProfileUpdateDTO);
        return ResponseEntity.ok(userSearchDTO);
    }

    /**
     * Get users filtered by role
     * @param role filter by role (optional)
     * @param pageable pagination
     * @return page of users
     */
    @GetMapping("")
    public ResponseEntity<Page<UserSearchDTO>> getUsersByRole(
            @RequestParam(value = "role", required = false) String role,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserSearchDTO> users = userSearchService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

}
