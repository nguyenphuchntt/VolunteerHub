package com.uet.VolunteerHub.dto.Media;

import java.util.UUID;

public record MediaDeleteResponse(
        String message,
        UUID id) {
}
