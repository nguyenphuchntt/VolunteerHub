package com.uet.VolunteerHub.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MediaReadDTO(
        UUID id,
        String url,
        String fileType,
        String mimeType,
        Long sizeBytes,
        OffsetDateTime uploadedAt,
        UUID uploadedBy) {
}
