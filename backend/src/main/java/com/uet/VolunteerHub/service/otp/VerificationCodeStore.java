package com.uet.VolunteerHub.service.otp;

import java.time.Duration;
import java.util.Optional;

public interface VerificationCodeStore {

    /**
     * Saves a verification code entry with TTL.
     */
    void save(OtpScope scope, String identifier, VerificationCodeEntry entry, Duration ttl);

    /**
     * Finds an active verification code entry.
     */
    Optional<VerificationCodeEntry> find(OtpScope scope, String identifier);

    /**
     * Increments the attempts counter for a code.
     */
    void incrementAttempts(OtpScope scope, String identifier);

    /**
     * Deletes a verification code entry.
     */
    void delete(OtpScope scope, String identifier);

    /**
     * Attempts to acquire a cooldown lock. Returns true if acquired, false if still in cooldown.
     */
    boolean tryAcquireCooldown(OtpScope scope, String identifier, Duration cooldown);

    /**
     * Increments the send count within a time window. Returns the new count.
     */
    long incrementSendCount(OtpScope scope, String identifier, Duration window);
}
