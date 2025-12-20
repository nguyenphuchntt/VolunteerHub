package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
public class EventRejectedEvent extends NotificationEvent {

    private final Event event;
    private final String reason;

    public EventRejectedEvent(Object source, Account admin, Event event, String reason) {
        super(source, admin, NotificationType.EVENT_REJECTED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.reason = reason;
    }

    @Override
    public List<Account> getRecipients() {
        Account creator = event.getCreatedBy();
        return creator != null ? Collections.singletonList(creator) : Collections.emptyList();
    }

    @Override
    public String buildContent() {
        if (reason != null && !reason.isBlank()) {
            return String.format("Your event \"%s\" has been rejected. Reason: %s", event.getTitle(), reason);
        }
        return String.format("Your event \"%s\" has been rejected by admin.", event.getTitle());
    }
}
