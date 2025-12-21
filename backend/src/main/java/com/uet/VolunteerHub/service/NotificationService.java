package com.uet.VolunteerHub.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Log
@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationSpecification notificationSpecification;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final CacheManager cacheManager;

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
                .and(notificationSpecification.isRead(isRead))
                .and(notificationSpecification.isDeleted(false));
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
        
        // Evict cache thủ công (không dùng annotation vì internal call không trigger AOP)
        Cache cache = cacheManager.getCache("notificationCounts");
        if (cache != null) {
            cache.evict(notification.getReceiverAccount().getAccountId());
        }
        
        return newStatus;
    }

    @Transactional
    public NotificationReadDTO updateNotificationType(Long notificationId, NotificationUpdateTypeDTO dto) {
        Notification notification = findNotificationById(notificationId);
        notification.setNotificationType(dto.getType());
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toDTO(savedNotification);
    }

    @Cacheable(value = "notificationCounts", key = "#receiverId")
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(UUID receiverId) {
        return notificationRepository.countByReceiverAccount_AccountIdAndIsReadFalseAndIsDeletedFalse(receiverId);
    }

    @CacheEvict(value = "notificationCounts", key = "#receiverId")
    @Transactional
    public void markAllAsRead(UUID receiverId) {
        notificationRepository.markAllAsReadByReceiverId(receiverId);
    }

    @Transactional
    public boolean deleteNotification(Long notificationId) {
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
        if (notificationOptional.isEmpty()) {
            return false;
        }
        Notification notification = notificationOptional.get();
        notification.setIsDeleted(true);
        notificationRepository.save(notification);
        return true;
    }

    @Transactional
    public void createNotification(Account sender, Account receiver, NotificationType type, String content) {
        if (sender.getAccountId().equals(receiver.getAccountId()) && type != NotificationType.SYSTEM_ANNOUNCEMENT) {
            return;
        }
        Notification notification = new Notification();
        notification.setSenderAccount(sender);
        notification.setReceiverAccount(receiver);
        notification.setNotificationType(type);
        notification.setContent(content);
        notification.setIsRead(false);
        notification.setIsDeleted(false);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationReadDTO> findAllForUserOrSystemAnnouncement(UUID receiverId) {
        var notifications = notificationRepository.findAllByReceiverAccount_AccountIdOrNotificationTypeAndIsDeletedFalse(
                receiverId, com.uet.VolunteerHub.enums.NotificationType.SYSTEM_ANNOUNCEMENT);
        return notifications.stream().map(notificationMapper::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public Page<NotificationReadDTO> findAllForUserOrSystemAnnouncementPaged(UUID receiverId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findAllForUserOrSystemAnnouncementPaged(receiverId, pageable);
        return notifications.map(notificationMapper::toDTO);
    }
}
