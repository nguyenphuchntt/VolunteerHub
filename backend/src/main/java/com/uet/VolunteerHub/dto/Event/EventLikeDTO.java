package com.uet.VolunteerHub.dto.Event;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class EventLikeDTO {
    private long eventId;
    private UUID accountId;
    private boolean liked;
    private int likesCount;
}
