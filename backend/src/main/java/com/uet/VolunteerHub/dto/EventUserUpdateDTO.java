package com.uet.VolunteerHub.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventUserUpdateDTO {
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
}

