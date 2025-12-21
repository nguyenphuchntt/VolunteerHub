package com.uet.VolunteerHub.exception;

/**
 * Exception thrown when a user attempts to change their own role.
 * Business logic dictates that:
 * - Admin cannot change their own account role (ADMIN -> USER/MANAGER)
 * - Event Manager cannot demote themselves to Attendee
 */
public class SelfRoleChangeException extends RuntimeException {
    public SelfRoleChangeException(String message) {
        super(message);
    }
}
