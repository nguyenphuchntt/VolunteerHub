package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Account.*;
import com.uet.VolunteerHub.service.UserWriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserWriteService userWriteService;

    @Autowired
    public AdminUserController(UserWriteService userWriteService) {
        this.userWriteService = userWriteService;
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



}
