package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventSearchCriteriaDTO {
    private Long eventId;
    private String title;
    private OffsetDateTime createAtFrom;
    private OffsetDateTime createAtTo;
    private OffsetDateTime startAtFrom;
    private OffsetDateTime startAtTo;
    private OffsetDateTime endAtFrom;
    private OffsetDateTime endAtTo;
    private String category;
    private String location;
    private EventStatus status;
    private UUID accountId;
    private String username;
    private String firstName;
    private String lastName;
}
