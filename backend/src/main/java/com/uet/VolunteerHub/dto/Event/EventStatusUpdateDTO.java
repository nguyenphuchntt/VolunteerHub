package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventStatusUpdateDTO {
    @NotNull(message = "Event status cannot be null")
    private EventStatus status;
}
