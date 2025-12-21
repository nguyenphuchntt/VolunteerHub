package com.uet.VolunteerHub.exception;

/**
 * Exception thrown when a banned account attempts to perform any action.
 * This exception is thrown at the authentication filter level to prevent
 * any API access from banned accounts.
 */
public class AccountBannedException extends RuntimeException {
    public AccountBannedException(String message) {
        super(message);
    }
}
