package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.notification.ManagerEventNotificationDTO;
import com.uet.VolunteerHub.dto.notification.ManagerJoinRequestNotificationDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.RoleBasedNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@PreAuthorize("hasRole('MANAGER')")
public class ManagerNotificationController {

    private final RoleBasedNotificationService roleBasedNotificationService;
    private final AccountRepository accountRepository;

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
        UUID managerId = getCurrentUserId(principal);
        Page<ManagerJoinRequestNotificationDTO> notifications = 
                roleBasedNotificationService.getManagerJoinRequestNotifications(managerId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getNotificationCounts(Principal principal) {
        UUID managerId = getCurrentUserId(principal);
        long unreadEventNotifications = roleBasedNotificationService.countUnreadManagerEventNotifications(managerId);
        long pendingJoinRequests = roleBasedNotificationService.countPendingJoinRequests(managerId);
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
