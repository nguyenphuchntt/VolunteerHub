package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventUserCreateDTO {

    @NotNull(message = "Account ID cannot be null")
    private UUID accountId;

    @NotNull(message = "Event ID cannot be null")
    private Long eventId;

    private EventUserStatus status;

    private EventUserRole role;

    @FutureOrPresent(message = "Start date must be today or in the future")
    private OffsetDateTime startAt;

    @FutureOrPresent(message = "End date must be today or in the future")
    private OffsetDateTime endAt;
}
