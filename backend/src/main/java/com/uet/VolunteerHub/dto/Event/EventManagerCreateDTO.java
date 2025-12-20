package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.validation.ValidEventCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventManagerCreateDTO {
    @NotBlank(message = "Title must not be blank")
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters")
    private String title;

    @FutureOrPresent(message = "Start date must be today or in the future")
    private OffsetDateTime startAt;

    @FutureOrPresent(message = "End date must be today or in the future")
    private OffsetDateTime endAt;

    @ValidEventCategory
    private String category;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Min(value = 0, message = "Attendee count must be at least 0")
    private int attendeeCount;
}
