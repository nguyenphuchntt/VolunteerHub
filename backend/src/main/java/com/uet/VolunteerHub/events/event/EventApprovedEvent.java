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
public class EventApprovedEvent extends NotificationEvent {

    private final Event event;

    public EventApprovedEvent(Object source, Account admin, Event event) {
        super(source, admin, NotificationType.EVENT_APPROVED, DestinationType.EVENT, 
              String.valueOf(event.getEventId()));
        this.event = event;
    }

    @Override
    public List<Account> getRecipients() {
        Account creator = event.getCreatedBy();
        return creator != null ? Collections.singletonList(creator) : Collections.emptyList();
    }

    @Override
    public String buildContent() {
        return String.format("Your event \"%s\" has been approved by admin.", event.getTitle());
    }
}
