package com.uet.VolunteerHub.dto;

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
