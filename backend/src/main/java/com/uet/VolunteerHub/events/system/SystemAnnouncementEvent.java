package com.uet.VolunteerHub.events.system;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
public class SystemAnnouncementEvent extends NotificationEvent {

    private final String content;

    public SystemAnnouncementEvent(Object source, Account admin, String content) {
        super(source, admin, NotificationType.SYSTEM_ANNOUNCEMENT, DestinationType.NONE, null);
        this.content = content;
    }

    @Override
    public List<Account> getRecipients() {
        // Return only the admin - we create a single record that broadcasts to all
        return Collections.singletonList(getActor());
    }

    @Override
    public String buildContent() {
        return content;
    }

    public boolean isBroadcast() {
        return true;
    }
}
