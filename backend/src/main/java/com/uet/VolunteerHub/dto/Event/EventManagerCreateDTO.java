package com.uet.VolunteerHub.dto.Event;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventManagerCreateDTO {
    @NotBlank(message = "Title must not be blank")
    private String title;

    private OffsetDateTime startAt;

    private OffsetDateTime endAt;
    private String category;
    private String location;
    private String description;

    private int attendeeCount;
}

