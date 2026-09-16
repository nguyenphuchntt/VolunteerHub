package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationReadDTO {
    private Long notificationId;
    private UUID senderAccountId;
    private String senderUsername;
    private UUID receiverAccountId;
    private String content;
    private Boolean isRead;
    private NotificationType type;
    private DestinationType destinationType;
    private String destinationId;
    private Instant createdAt;
}

