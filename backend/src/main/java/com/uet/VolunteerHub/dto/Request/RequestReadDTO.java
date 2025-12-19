package com.uet.VolunteerHub.dto.Request;

import com.uet.VolunteerHub.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestReadDTO {

    private Long requestId;
    private UUID accountId;
    private String username;
    private String email;
    private RequestStatus status;
    private String reason;
    private String adminResponse;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
