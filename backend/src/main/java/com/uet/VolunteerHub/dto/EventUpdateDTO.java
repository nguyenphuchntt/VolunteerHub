package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class EventUpdateDTO {
    private String title;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String category;
    private String location;
    private String description;
    private EventStatus status;
    private Integer attendeeCount;
}
