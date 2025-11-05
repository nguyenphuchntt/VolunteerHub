package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Data;

@Data
public class EventStatusUpdateDTO {
    private EventStatus status;
}
