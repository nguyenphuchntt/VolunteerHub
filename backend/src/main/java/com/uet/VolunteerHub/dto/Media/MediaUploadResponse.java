package com.uet.VolunteerHub.dto.Media;

import java.util.UUID;

public record MediaUploadResponse(
        UUID id,
        String url,
        String fileName,
        String fileType,
        String mimeType,
        Long sizeBytes,
        String message) {
}
