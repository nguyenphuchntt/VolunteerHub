package com.uet.VolunteerHub.events.base;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.List;

@Getter
public abstract class NotificationEvent extends ApplicationEvent {

    protected final Account actor;
    protected final NotificationType notificationType;
    protected final DestinationType destinationType;
    protected final String destinationId;

    protected NotificationEvent(Object source, Account actor, NotificationType notificationType,
                                DestinationType destinationType, String destinationId) {
        super(source);
        this.actor = actor;
        this.notificationType = notificationType;
        this.destinationType = destinationType;
        this.destinationId = destinationId;
    }

    public abstract List<Account> getRecipients();
    public abstract String buildContent();
}
