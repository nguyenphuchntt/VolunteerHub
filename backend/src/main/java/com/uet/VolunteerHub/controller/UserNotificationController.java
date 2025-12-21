package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.notification.UserRoleRequestNotificationDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.RoleBasedNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;

/**
 * REST controller for user-specific notifications
 */
@RestController
@RequestMapping("/api/user/notifications")
@RequiredArgsConstructor
public class UserNotificationController {

    private final RoleBasedNotificationService roleBasedNotificationService;
    private final AccountRepository accountRepository;

    /**
     * Get role request notifications for user
     * @param principal authenticated user
     * @param pageable pagination
     * @return page of role request notifications
     */
    @GetMapping("/role-requests")
    public ResponseEntity<Page<UserRoleRequestNotificationDTO>> getRoleRequestNotifications(
            Principal principal,
            @PageableDefault(size = 20, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UUID userId = getCurrentUserId(principal);
        Page<UserRoleRequestNotificationDTO> notifications = 
                roleBasedNotificationService.getUserRoleRequestNotifications(userId, pageable);
        return ResponseEntity.ok(notifications);
    }

    private UUID getCurrentUserId(Principal principal) {
        if (principal == null) {
            throw new SecurityException("User must be authenticated");
        }
        String username = principal.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return account.getAccountId();
    }
}
