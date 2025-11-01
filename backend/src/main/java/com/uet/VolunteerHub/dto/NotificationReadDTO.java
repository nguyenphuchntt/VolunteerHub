package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationReadDTO {
    private Long notificationId;
    private UUID senderAccountId;
    private UUID receiverAccountId;
    private String content;
    private Boolean isRead;
    private NotificationType type;
}
