package com.uet.VolunteerHub.dto.Event;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventCreateDTO {
    private String title;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String category;
    private String location;
    private String description;
}
