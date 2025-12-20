package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.notification.ManagerEventNotificationDTO;
import com.uet.VolunteerHub.dto.notification.ManagerJoinRequestNotificationDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/manager/notifications")
@RequiredArgsConstructor
public class ManagerNotificationController {

    private final RoleBasedNotificationService roleBasedNotificationService;
    private final AccountRepository accountRepository;

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/events")
    public ResponseEntity<Page<ManagerEventNotificationDTO>> getEventNotifications(
            Principal principal,
            @PageableDefault(size = 20, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UUID managerId = getCurrentUserId(principal);
        Page<ManagerEventNotificationDTO> notifications = 
                roleBasedNotificationService.getManagerEventNotifications(managerId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/join-requests")
    public ResponseEntity<Page<ManagerJoinRequestNotificationDTO>> getJoinRequestNotifications(
            Principal principal,
            @PageableDefault(size = 20, sort = "registeredAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UUID userId = getCurrentUserId(principal);
        Page<ManagerJoinRequestNotificationDTO> notifications = 
                roleBasedNotificationService.getManagerJoinRequestNotifications(userId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Object>> getNotificationCounts(Principal principal) {
        UUID userId = getCurrentUserId(principal);
        
        // Check if user has UserRole.MANAGER for event notifications
        Account account = accountRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        long unreadEventNotifications = 0;
        if (account.getRole() == com.uet.VolunteerHub.enums.UserRole.MANAGER) {
            unreadEventNotifications = roleBasedNotificationService.countUnreadManagerEventNotifications(userId);
        }
        
        // Pending join requests - for EventUserRole.MANAGER (query handles security)
        long pendingJoinRequests = roleBasedNotificationService.countPendingJoinRequests(userId);
        
        return ResponseEntity.ok(Map.of(
                "unreadEventNotifications", unreadEventNotifications,
                "pendingJoinRequests", pendingJoinRequests,
                "total", unreadEventNotifications + pendingJoinRequests
        ));
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
