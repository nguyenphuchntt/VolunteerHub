package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventMediaId implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID mediaId;
    private Long eventId;
}
