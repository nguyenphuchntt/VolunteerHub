package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventUserCreateDTO {
    @NotNull
    private Long eventId;

    @NotNull
    private UUID accountId;

    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
}

