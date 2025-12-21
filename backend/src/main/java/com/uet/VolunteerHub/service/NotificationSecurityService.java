package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("notificationSecurityService")
public class NotificationSecurityService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationSecurityService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public boolean isReceiver(Long notificationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) {
            return false;
        }
        if (notificationId == null) {
            return false;
        }
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
        if (notificationOptional.isEmpty()) {
            return false;
        }
        Notification notification = notificationOptional.get();
        return notification.getReceiverAccount().getAccountId().equals(account.getAccountId());
    }
}
