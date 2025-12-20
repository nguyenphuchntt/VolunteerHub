package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventCancelledEvent extends NotificationEvent {

    private final Event event;
    private final List<Account> participants;
    private final String reason;

    public EventCancelledEvent(Object source, Account actor, Event event, 
                               List<Account> participants, String reason) {
        super(source, actor, NotificationType.EVENT_CANCELLED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.participants = participants;
        this.reason = reason;
    }

    @Override
    public List<Account> getRecipients() {
        return participants != null ? participants : List.of();
    }

    @Override
    public String buildContent() {
        if (reason != null && !reason.isBlank()) {
            return String.format("The event \"%s\" has been cancelled. Reason: %s", event.getTitle(), reason);
        }
        return String.format("The event \"%s\" has been cancelled.", event.getTitle());
    }
}
