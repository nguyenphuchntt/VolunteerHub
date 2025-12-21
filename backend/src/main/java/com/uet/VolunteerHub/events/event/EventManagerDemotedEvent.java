package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventManagerDemotedEvent extends NotificationEvent {

    private final Event event;
    private final Account demotedUser;

    public EventManagerDemotedEvent(Object source, Account demoter, Event event, Account demotedUser) {
        super(source, demoter, NotificationType.EVENT_MANAGER_DEMOTED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.demotedUser = demotedUser;
    }

    @Override
    public List<Account> getRecipients() {
        return demotedUser != null ? List.of(demotedUser) : List.of();
    }

    @Override
    public String buildContent() {
        return String.format("Bạn đã bị gỡ khỏi vai trò quản lý của sự kiện \"%s\".", event.getTitle());
    }
}
