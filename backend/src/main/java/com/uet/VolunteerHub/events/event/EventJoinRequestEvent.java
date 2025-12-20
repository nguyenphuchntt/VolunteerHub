package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventJoinRequestEvent extends NotificationEvent {

    private final Event event;
    private final Account requester;
    private final List<Account> eventManagers;

    public EventJoinRequestEvent(Object source, Account requester, Event event, List<Account> eventManagers) {
        super(source, requester, NotificationType.EVENT_JOIN_REQUEST, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.requester = requester;
        this.eventManagers = eventManagers;
    }

    @Override
    public List<Account> getRecipients() {
        return eventManagers != null ? eventManagers : List.of();
    }

    @Override
    public String buildContent() {
        return String.format("User \"%s\" has requested to join your event \"%s\".",
                           requester.getUsername(), event.getTitle());
    }
}
