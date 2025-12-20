package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.enums.DestinationType;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service specifically for creating notifications from events.
 * This separates the notification creation logic from the main NotificationService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationCreationService {

    private final NotificationRepository notificationRepository;
    private final PushNotificationService pushNotificationService;

    /**
     * Creates a notification for a single recipient.
     *
     * @param sender          The account that triggered the notification
     * @param receiver        The account that will receive the notification
     * @param type            The type of notification
     * @param content         The notification content
     * @param destinationType The type of destination for navigation
     * @param destinationId   The ID of the destination entity
     */
    @CacheEvict(value = "notificationCounts", key = "#receiver.accountId")
    @Transactional
    public void createNotification(Account sender, Account receiver, NotificationType type,
                                   String content, DestinationType destinationType, String destinationId) {
        // Don't create notification if sender is receiver (except for system announcements)
        if (sender.getAccountId().equals(receiver.getAccountId()) && type != NotificationType.SYSTEM_ANNOUNCEMENT) {
            return;
        }

        Notification notification = Notification.builder()
                .senderAccount(sender)
                .receiverAccount(receiver)
                .notificationType(type)
                .content(content)
                .isRead(false)
                .isDeleted(false)
                .destinationType(destinationType)
                .destinationId(destinationId)
                .build();

        notificationRepository.save(notification);
        log.debug("Created notification for user {}: type={}, content={}", 
                 receiver.getAccountId(), type, content);
    }

    /**
     * Creates notifications for multiple recipients and sends push notifications.
     *
     * @param sender          The account that triggered the notification
     * @param recipients      List of accounts that will receive the notification
     * @param type            The type of notification
     * @param content         The notification content
     * @param destinationType The type of destination for navigation
     * @param destinationId   The ID of the destination entity
     */
    @Transactional
    public void createNotificationsForMultipleRecipients(Account sender, List<Account> recipients,
                                                          NotificationType type, String content,
                                                          DestinationType destinationType, String destinationId) {
        if (recipients == null || recipients.isEmpty()) {
            return;
        }

        for (Account recipient : recipients) {
            createNotification(sender, recipient, type, content, destinationType, destinationId);
        }

        // Send push notifications
        List<UUID> recipientIds = recipients.stream()
                .filter(r -> !r.getAccountId().equals(sender.getAccountId()) || type == NotificationType.SYSTEM_ANNOUNCEMENT)
                .map(Account::getAccountId)
                .toList();

        if (!recipientIds.isEmpty()) {
            pushNotificationService.pushNotificationToMultipleUsers(recipientIds, content);
        }

        log.info("Created {} notifications for type: {}", recipients.size(), type);
    }

    /**
     * Creates a system announcement (single record that broadcasts to all users).
     *
     * @param admin   The admin creating the announcement
     * @param content The announcement content
     */
    @Transactional
    public void createSystemAnnouncement(Account admin, String content) {
        Notification notification = Notification.builder()
                .senderAccount(admin)
                .receiverAccount(admin) // sender = receiver for system announcements
                .notificationType(NotificationType.SYSTEM_ANNOUNCEMENT)
                .content(content)
                .isRead(false)
                .isDeleted(false)
                .destinationType(DestinationType.NONE)
                .destinationId(null)
                .build();

        notificationRepository.save(notification);
        log.info("Created system announcement by admin {}: {}", admin.getUsername(), content);

        // Note: Push notification for system announcements should be handled separately
        // since we need to push to ALL users, not just a specific list
    }
}
