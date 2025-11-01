package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.NotificationReadDTO;
import com.uet.VolunteerHub.dto.NotificationUpdateTypeDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.mapper.NotificationMapper;
import com.uet.VolunteerHub.repository.NotificationRepository;
import com.uet.VolunteerHub.repository.specification.NotificationSpecification;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Log
@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationSpecification notificationSpecification;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public Page<NotificationReadDTO> searchNotification(
            Long notificationId,
            UUID senderAccountId,
            UUID receiverAccountId,
            NotificationType type,
            Boolean isRead,
            Pageable pageable) {
        Specification<Notification> spec = Specification
                .where(notificationSpecification.hasId(notificationId))
                .and(notificationSpecification.hasSenderId(senderAccountId))
                .and(notificationSpecification.hasReceiverId(receiverAccountId))
                .and(notificationSpecification.hasType(type))
                .and(notificationSpecification.isRead(isRead));
        Page<Notification> notificationPage = notificationRepository.findAll(spec, pageable);
        return notificationPage.map(notificationMapper::toDTO);
    }

    private Notification findNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
    }

    @Transactional
    public boolean toggleIsRead(Long notificationId) {
        Notification notification = findNotificationById(notificationId);
        boolean currentStatus = notification.getIsRead();
        boolean newStatus = !currentStatus;
        notification.setIsRead(newStatus);
        notificationRepository.save(notification);
        return newStatus;
    }

    @Transactional
    public NotificationReadDTO updateNotificationType(Long notificationId, NotificationUpdateTypeDTO dto) {
        Notification notification = findNotificationById(notificationId);
        notification.setNotificationType(dto.getType());
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Transactional(readOnly = true)
    public Long getUnreadNotificationCount(UUID receiverId) {
        return notificationRepository.countByReceiverAccount_AccountIdAndIsReadFalse(receiverId);
    }

    @Transactional
    public void markAllAsRead(UUID receiverId) {
        notificationRepository.markAllAsReadByReceiverId(receiverId);
    }

    @Transactional
    public void createNotification(Account sender, Account receiver, NotificationType type, String content) {
        if (sender.getAccountId().equals(receiver.getAccountId())) {
            return;
        }
        Notification notification = new Notification();
        notification.setSenderAccount(sender);
        notification.setReceiverAccount(receiver);
        notification.setNotificationType(type);
        notification.setContent(content);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }


}
