package com.uet.VolunteerHub.listener;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.events.base.NotificationEvent;
import com.uet.VolunteerHub.events.system.SystemAnnouncementEvent;
import com.uet.VolunteerHub.service.NotificationCreationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;


@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationCreationService notificationCreationService;

    @Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNotificationEvent(NotificationEvent event) {
        try {
            log.debug("Handling notification event: {}", event.getClass().getSimpleName());
            if (event instanceof SystemAnnouncementEvent systemAnnouncementEvent) {
                handleSystemAnnouncement(systemAnnouncementEvent);
                return;
            }
            Account actor = event.getActor();
            List<Account> recipients = event.getRecipients();
            String content = event.buildContent();

            if (recipients == null || recipients.isEmpty()) {
                log.warn("No recipients for event: {}", event.getClass().getSimpleName());
                return;
            }
            notificationCreationService.createNotificationsForMultipleRecipients(
                    actor,
                    recipients,
                    event.getNotificationType(),
                    content,
                    event.getDestinationType(),
                    event.getDestinationId()
            );
            log.info("Processed {} notification(s) for event: {}", 
                    recipients.size(), event.getClass().getSimpleName());

        } catch (Exception e) {
            log.error("Failed to process notification event {}: {}", 
                     event.getClass().getSimpleName(), e.getMessage(), e);
        }
    }

    private void handleSystemAnnouncement(SystemAnnouncementEvent event) {
        try {
            notificationCreationService.createSystemAnnouncement(
                    event.getActor(),
                    event.buildContent()
            );
            log.info("Created system announcement from admin: {}", event.getActor().getUsername());
        } catch (Exception e) {
            log.error("Failed to create system announcement: {}", e.getMessage(), e);
        }
    }
}
