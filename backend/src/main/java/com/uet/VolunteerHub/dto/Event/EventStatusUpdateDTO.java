package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EventStatusUpdateDTO {
    @NotNull(message = "Event status cannot be null")
    private EventStatus status;

    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
}

