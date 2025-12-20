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
public class RoleRequestRejectedEvent extends NotificationEvent {

    private final Request request;

    public RoleRequestRejectedEvent(Object source, Account admin, Request request) {
        super(source, admin, NotificationType.ROLE_REQUEST_REJECTED, DestinationType.DASHBOARD, null);
        this.request = request;
    }

    @Override
    public List<Account> getRecipients() {
        Account requester = request.getAccount();
        return requester != null ? Collections.singletonList(requester) : Collections.emptyList();
    }

    @Override
    public String buildContent() {
        String adminResponse = request.getAdminResponse();
        if (adminResponse != null && !adminResponse.isBlank()) {
            return String.format("Your request to become a Manager has been rejected. Reason: %s", adminResponse);
        }
        return "Your request to become a Manager has been rejected.";
    }
}
