package com.uet.VolunteerHub.dto.EventUser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventUserRegisterDTO {
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
}
