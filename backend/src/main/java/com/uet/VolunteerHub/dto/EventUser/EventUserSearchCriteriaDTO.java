package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventUserSearchCriteriaDTO {
    private Long eventId;
    private UUID accountId;
    private Instant registeredAtTo;
    private Instant registeredAtFrom;
    private EventUserStatus status;
    private EventUserRole role;
    private Instant startAtFrom;
    private Instant startAtTo;
    private Instant endAtFrom;
    private Instant endAtTo;
    private String firstName;
    private String lastName;
    private String eventTitle;
    private String eventLocation;
}
