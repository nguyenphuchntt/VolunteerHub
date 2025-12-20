package com.uet.VolunteerHub.events.request;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Request;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
public class RoleRequestApprovedEvent extends NotificationEvent {

    private final Request request;

    public RoleRequestApprovedEvent(Object source, Account admin, Request request) {
        super(source, admin, NotificationType.ROLE_REQUEST_APPROVED, DestinationType.DASHBOARD, null);
        this.request = request;
    }

    @Override
    public List<Account> getRecipients() {
        Account requester = request.getAccount();
        return requester != null ? Collections.singletonList(requester) : Collections.emptyList();
    }

    @Override
    public String buildContent() {
        return "Your request to become a Manager has been approved. You can now create and manage events.";
    }
}
