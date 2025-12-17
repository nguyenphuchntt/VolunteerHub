package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.NotificationReadDTO;
import com.uet.VolunteerHub.dto.NotificationUpdateTypeDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.NotificationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;
import com.uet.VolunteerHub.service.NotificationSecurityService;
import org.springframework.security.access.prepost.PreAuthorize;

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

//    @PreAuthorize("@notificationSecurityService.isReceiver(#notificationId)")
//    @PatchMapping("/{notificationId}/type")
//    public ResponseEntity<NotificationReadDTO> updateNotificationType(
//            @PathVariable Long notificationId,
//            @RequestBody @Valid NotificationUpdateTypeDTO dto) {
//        NotificationReadDTO updatedNotification = notificationService.updateNotificationType(notificationId, dto);
//        return ResponseEntity.ok(updatedNotification);
//    }

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

//    @PreAuthorize("@notificationSecurityService.isReceiver(#notificationId)")
//    @DeleteMapping("/{notificationId}")
//    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
//        boolean isDeleted = notificationService.deleteNotification(notificationId);
//        if (isDeleted) {
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
}