package com.uet.VolunteerHub.dto.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class EventSearchCriteriaDTO {
    private Long eventId;
    private String title;
    private Instant createAtFrom;
    private Instant createAtTo;
    private Instant startAtFrom;
    private Instant startAtTo;
    private Instant endAtFrom;
    private Instant endAtTo;
    private String category;
    private String location;
    private EventStatus status;
    private UUID accountId;
    private String username;
    private String firstName;
    private String lastName;
}
