package com.uet.VolunteerHub.dto;

import java.time.Instant;
import java.util.UUID;

public record MediaReadDTO(
        UUID id,
        String url,
        String fileType,
        String mimeType,
        Long sizeBytes,
        Instant createdAt,
        UUID uploadedBy) {
}
