package com.uet.VolunteerHub.events.request;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Request;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.List;

@Getter
public class ManagerRoleRequestEvent extends NotificationEvent {

    private final Request request;
    private final List<Account> admins;

    public ManagerRoleRequestEvent(Object source, Account requester, Request request, List<Account> admins) {
        super(source, requester, NotificationType.MANAGER_ROLE_REQUEST, DestinationType.REQUEST,
              String.valueOf(request.getRequestId()));
        this.request = request;
        this.admins = admins;
    }

    @Override
    public List<Account> getRecipients() {
        return admins != null ? admins : List.of();
    }

    @Override
    public String buildContent() {
        String reason = request.getReason();
        if (reason != null && !reason.isBlank()) {
            return String.format("User \"%s\" has requested to become a Manager. Reason: %s",
                               getActor().getUsername(), reason);
        }
        return String.format("User \"%s\" has requested to become a Manager. Please review.",
                           getActor().getUsername());
    }
}
