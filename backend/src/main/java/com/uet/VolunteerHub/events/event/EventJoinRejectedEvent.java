package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventJoinRejectedEvent extends NotificationEvent {

    private final Event event;
    private final List<Account> rejectedUsers;

    public EventJoinRejectedEvent(Object source, Account manager, Event event, List<Account> rejectedUsers) {
        super(source, manager, NotificationType.EVENT_JOIN_REJECTED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.rejectedUsers = rejectedUsers;
    }

    @Override
    public List<Account> getRecipients() {
        return rejectedUsers != null ? rejectedUsers : List.of();
    }

    @Override
    public String buildContent() {
        return String.format("Your registration for the event \"%s\" has been rejected.", event.getTitle());
    }
}
