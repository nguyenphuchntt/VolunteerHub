package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class EventUserSearchDTO {
    private Long eventId;
    private UUID accountId;
    private OffsetDateTime registeredAt;
    private EventUserStatus status;
    private EventUserRole role;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String title;
    private String description;
    private String location;
    private EventStatus eventStatus;
    private String coverImageUrl;
    private OffsetDateTime eventStartAt;
    private OffsetDateTime eventEndAt;
}
