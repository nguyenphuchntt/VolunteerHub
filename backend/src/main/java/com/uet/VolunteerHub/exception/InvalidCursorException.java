package com.uet.VolunteerHub.exception;

/**
 * Thrown when cursor parameter is malformed or invalid.
 * Maps to HTTP 400 BAD_REQUEST.
 */
public class InvalidCursorException extends RuntimeException {

    public InvalidCursorException(String message) {
        super(message);
    }

    public InvalidCursorException(String message, Throwable cause) {
        super(message, cause);
    }
}
