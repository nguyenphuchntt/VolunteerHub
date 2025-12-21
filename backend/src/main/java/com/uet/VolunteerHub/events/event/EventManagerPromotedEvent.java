package com.uet.VolunteerHub.events.event;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class EventManagerPromotedEvent extends NotificationEvent {

    private final Event event;
    private final Account promotedUser;

    public EventManagerPromotedEvent(Object source, Account promoter, Event event, Account promotedUser) {
        super(source, promoter, NotificationType.EVENT_MANAGER_PROMOTED, DestinationType.EVENT,
              String.valueOf(event.getEventId()));
        this.event = event;
        this.promotedUser = promotedUser;
    }

    @Override
    public List<Account> getRecipients() {
        return promotedUser != null ? List.of(promotedUser) : List.of();
    }

    @Override
    public String buildContent() {
        return String.format("Bạn đã được thăng chức làm quản lý của sự kiện \"%s\".", event.getTitle());
    }
}
