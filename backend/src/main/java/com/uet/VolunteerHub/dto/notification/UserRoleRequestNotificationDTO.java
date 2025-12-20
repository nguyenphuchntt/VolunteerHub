package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DTO for user notifications about their manager role request being approved/rejected
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleRequestNotificationDTO {
    private Long notificationId;
    private NotificationType type; // ROLE_REQUEST_APPROVED, ROLE_REQUEST_REJECTED
    private String content;
    private String adminResponse; // Admin's response message
    private Boolean isRead;
    private OffsetDateTime createdAt;
    private UUID adminAccountId;
    private String adminUsername;
}
