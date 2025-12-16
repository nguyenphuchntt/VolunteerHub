package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventLikeId implements Serializable {
    private long eventId;
    private UUID accountId;
}
