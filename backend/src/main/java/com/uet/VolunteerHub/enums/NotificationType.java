package com.uet.VolunteerHub.enums;

public enum NotificationType {
    // Post related
    POST_LIKE, POST_COMMENT, COMMENT_REPLY,
    
    // Event reminders
    EVENT_START_REMINDER, EVENT_END_REMINDER,
    
    // Event join request (for attendees)
    EVENT_JOIN_APPROVED, EVENT_JOIN_REJECTED,
    
    // Event approval (for managers - their events being approved/rejected by admin)
    EVENT_APPROVED, EVENT_REJECTED,
    
    // Event join request notification (for managers - someone wants to join their event)
    EVENT_JOIN_REQUEST,
    
    // Role requests (for admin - user requesting manager role)
    MANAGER_ROLE_REQUEST,
    
    // Role request results (for users - their request being processed)
    ROLE_REQUEST_APPROVED, ROLE_REQUEST_REJECTED,
    
    // Social
    NEW_FOLLOWER,
    
    // General
    OTHER, SYSTEM_ANNOUNCEMENT, NORMAL
}
