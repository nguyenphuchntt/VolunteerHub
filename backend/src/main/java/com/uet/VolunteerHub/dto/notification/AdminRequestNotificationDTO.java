package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for admin notifications about pending requests (manager role requests, event creation requests)
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminRequestNotificationDTO {
    private Long requestId;
    private UUID requesterAccountId;
    private String requesterUsername;
    private String requesterFullName;
    private String requesterEmail;
    private String requesterAvatarUrl;
    private RequestStatus status;
    private String reason; // User's reason for the request
    private Instant createdAt;
}
