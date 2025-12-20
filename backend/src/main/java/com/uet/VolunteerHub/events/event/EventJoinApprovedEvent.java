package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventJoinApprovedEvent extends NotificationEvent {

    private final Event event;
    private final List<Account> approvedUsers;

    public EventJoinApprovedEvent(Object source, Account manager, Event event, List<Account> approvedUsers) {
        super(source, manager, NotificationType.EVENT_JOIN_APPROVED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.approvedUsers = approvedUsers;
    }

    @Override
    public List<Account> getRecipients() {
        return approvedUsers != null ? approvedUsers : List.of();
    }

    @Override
    public String buildContent() {
        return String.format("Your registration for the event \"%s\" has been approved.", event.getTitle());
    }
}
