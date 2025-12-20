package com.uet.VolunteerHub.controller;

import java.security.Principal;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uet.VolunteerHub.dto.NotificationReadDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.NotificationSecurityService;
import com.uet.VolunteerHub.service.NotificationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AccountRepository accountRepository;
    private final NotificationSecurityService notificationSecurityService;

    @PreAuthorize("@notificationSecurityService.isReceiver(#notificationId)")
    @PatchMapping("/{notificationId}/toggle-read")
    public ResponseEntity<Map<String, Boolean>> toggleReadStatus(
            @PathVariable Long notificationId) {
        boolean newReadStatus = notificationService.toggleIsRead(notificationId);
        return ResponseEntity.ok(Map.of("isRead", newReadStatus));
    }

    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<NotificationReadDTO>> searchNotification(
            @RequestParam(required = false) Long notificationId,
            @RequestParam(required = false) UUID senderAccountId,
            @RequestParam(required = false) com.uet.VolunteerHub.enums.NotificationType type,
            @RequestParam(required = false) Boolean isRead,
            org.springframework.data.domain.Pageable pageable,
            Principal principal) {
        UUID receiverAccountId = getCurrentUserId(principal);
        org.springframework.data.domain.Page<NotificationReadDTO> notifications = notificationService.searchNotification(
                notificationId, senderAccountId, receiverAccountId, type, isRead, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        UUID receiverId = getCurrentUserId(principal);
        Long count = notificationService.getUnreadNotificationCount(receiverId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
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

    @PatchMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        UUID receiverId = getCurrentUserId(principal);
        notificationService.markAllAsRead(receiverId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<org.springframework.data.domain.Page<NotificationReadDTO>> getMyNotifications(
            Principal principal,
            @org.springframework.data.web.PageableDefault(size = 20, sort = "createAt", direction = org.springframework.data.domain.Sort.Direction.DESC)
            org.springframework.data.domain.Pageable pageable) {
        UUID receiverId = getCurrentUserId(principal);
        org.springframework.data.domain.Page<NotificationReadDTO> notifications =
                notificationService.findAllForUserOrSystemAnnouncementPaged(receiverId, pageable);
        return ResponseEntity.ok(notifications);
    }
}