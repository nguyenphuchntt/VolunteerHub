package com.uet.VolunteerHub.exception;

public class RateLimitExceededException extends RuntimeException {

    private final long retryAfterSeconds;
    private final String clientIdentifier;

    public RateLimitExceededException(String message, long retryAfterSeconds, String clientIdentifier) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
        this.clientIdentifier = clientIdentifier;
    }

    public RateLimitExceededException(String message, long retryAfterSeconds) {
        this(message, retryAfterSeconds, null);
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public String getClientIdentifier() {
        return clientIdentifier;
    }
}
