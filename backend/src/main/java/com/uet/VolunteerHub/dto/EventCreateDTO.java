package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventCreateDTO {
    private String title;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String category;
    private String location;
    private String description;
}
