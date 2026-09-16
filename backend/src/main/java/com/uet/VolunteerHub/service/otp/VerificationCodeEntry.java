package com.uet.VolunteerHub.service.otp;

import java.time.Instant;

public record VerificationCodeEntry(
        String codeHash,
        int attempts,
        Instant issuedAt
) {
}
