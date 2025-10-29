package com.uet.VolunteerHub.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class EventUserId implements Serializable {
    private Long eventId;
    private UUID accountId;

    public EventUserId(Long eventId, UUID accountId) {
        this.eventId = eventId;
        this.accountId = accountId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, accountId);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof EventUserId other) {
            return eventId.equals(other.eventId) && accountId.equals(other.accountId);
        }
        return false;
    }
}
