package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.Data;


import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class EventUserCreateDTO {

    private UUID accountId;

    private Long eventId;

    private EventUserStatus status;

    private EventUserRole role;

    private OffsetDateTime startAt;

    private OffsetDateTime endAt;

}
