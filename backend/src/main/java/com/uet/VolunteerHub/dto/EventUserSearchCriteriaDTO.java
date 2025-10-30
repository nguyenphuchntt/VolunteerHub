package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventUserSearchCriteriaDTO {
    private Long eventId;
    private UUID accountId;
    private OffsetDateTime registeredAtTo;
    private OffsetDateTime registeredAtFrom;
    private EventUserStatus status;
    private EventUserRole role;
    private OffsetDateTime startAtFrom;
    private OffsetDateTime startAtTo;
    private OffsetDateTime endAtFrom;
    private OffsetDateTime endAtTo;
    private String firstName;
    private String lastName;
    private String eventTitle;
    private String eventLocation;
}
