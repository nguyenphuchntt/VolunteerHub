package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DTO for manager notifications about event approval/rejection
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManagerEventNotificationDTO {
    private Long notificationId;
    private Long eventId;
    private String eventTitle;
    private NotificationType type; // EVENT_APPROVED, EVENT_REJECTED, etc.
    private String content;
    private Boolean isRead;
    private OffsetDateTime createdAt;
    private UUID senderAccountId;
    private String senderUsername;
}
