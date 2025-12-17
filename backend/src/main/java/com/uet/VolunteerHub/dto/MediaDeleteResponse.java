package com.uet.VolunteerHub.dto;

import java.util.UUID;

public record MediaDeleteResponse(
        String message,
        UUID id) {
}
