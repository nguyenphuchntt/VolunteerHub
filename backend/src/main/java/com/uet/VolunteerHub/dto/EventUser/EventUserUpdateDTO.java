package com.uet.VolunteerHub.dto.EventUser;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;

import java.time.Instant;

@Data
public class EventUserUpdateDTO {
    @FutureOrPresent(message = "Start date must be today or in the future")
    private Instant startAt;

    @FutureOrPresent(message = "End date must be today or in the future")
    private Instant endAt;
}
