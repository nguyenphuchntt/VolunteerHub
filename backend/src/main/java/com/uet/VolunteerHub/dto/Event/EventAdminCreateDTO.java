package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventAdminCreateDTO {
    private String title;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String category;
    private String location;
    private String description;
    private EventStatus status;
    private int attendeeCount;
}
