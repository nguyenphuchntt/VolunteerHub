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
import java.util.Map; // Dùng để trả về JSON đơn giản
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    @PatchMapping("/{notificationId}/toggle-read")
    public ResponseEntity<Map<String, Boolean>> toggleReadStatus(
            @PathVariable Long notificationId) {
        boolean newReadStatus = notificationService.toggleIsRead(notificationId);
        return ResponseEntity.ok(Map.of("isRead", newReadStatus));
    }

    @PatchMapping("/{notificationId}/type")
    public ResponseEntity<NotificationReadDTO> updateNotificationType(
            @PathVariable Long notificationId,
            @RequestBody @Valid NotificationUpdateTypeDTO dto) {
        NotificationReadDTO updatedNotification = notificationService.updateNotificationType(notificationId, dto);
        return ResponseEntity.ok(updatedNotification);
    }

//    @GetMapping("/unread-count")
//    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
//        UUID receiverId = getCurrentUserId(principal);
//        Long count = notificationService.getUnreadNotificationCount(receiverId);
//        return ResponseEntity.ok(Map.of("unreadCount", count));
//    }
//
//    private UUID getCurrentUserId(Principal principal) {
//        if (principal == null) {
//            throw new SecurityException("User must be authenticated");
//        }
//        String username = principal.getName();
//        Account account = accountRepository.findByUsername(username)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
//        return account.getAccountId();
//    }

//    @PatchMapping("/mark-all-as-read")
//    public ResponseEntity<Void> markAllAsRead(Principal principal) {
//        UUID receiverId = getCurrentUserId(principal);
//        notificationService.markAllAsRead(receiverId);
//        return ResponseEntity.noContent().build();
//    }

    // soft delete
}