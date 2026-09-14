package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for manager notifications about pending join requests for their events
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManagerJoinRequestNotificationDTO {
    private Long eventId;
    private String eventTitle;
    private UUID requesterAccountId;
    private String requesterUsername;
    private String requesterFullName;
    private String requesterAvatarUrl;
    private EventUserStatus status;
    private Instant requestedAt;
}
