package com.uet.VolunteerHub.dto.Post;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostEventUpdateDTO {
    @NotNull(message = "EventId cannot be null")
    private Long eventId;
}