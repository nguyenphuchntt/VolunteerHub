package com.uet.VolunteerHub.dto.EventUser;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventUserRegisterDTO {
    @FutureOrPresent(message = "Start date must be today or in the future")
    private OffsetDateTime startAt;

    @FutureOrPresent(message = "End date must be today or in the future")
    private OffsetDateTime endAt;
}
