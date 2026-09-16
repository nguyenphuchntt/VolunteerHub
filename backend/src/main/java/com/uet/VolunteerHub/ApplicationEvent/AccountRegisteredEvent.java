package com.uet.VolunteerHub.ApplicationEvent;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AccountRegisteredEvent {
    private final UUID accountId;
    private final String username;
    private final String email;
    private final Instant createdAt;
}
