package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.notification.AdminRequestNotificationDTO;
import com.uet.VolunteerHub.dto.notification.ManagerEventNotificationDTO;
import com.uet.VolunteerHub.dto.notification.ManagerJoinRequestNotificationDTO;
import com.uet.VolunteerHub.dto.notification.UserRoleRequestNotificationDTO;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.entity.Request;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.enums.RequestStatus;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.NotificationRepository;
import com.uet.VolunteerHub.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleBasedNotificationService {

    private final NotificationRepository notificationRepository;
    private final EventUserRepository eventUserRepository;
    private final RequestRepository requestRepository;

    @Transactional(readOnly = true)
    public Page<ManagerEventNotificationDTO> getManagerEventNotifications(UUID managerId, Pageable pageable) {
        List<NotificationType> types = Arrays.asList(
                NotificationType.EVENT_APPROVED,
                NotificationType.EVENT_REJECTED
        );
        Page<Notification> notifications = notificationRepository.findManagerEventNotifications(
                managerId, types, pageable);
        return notifications.map(this::toManagerEventNotificationDTO);
    }

    @Transactional(readOnly = true)
    public Page<ManagerJoinRequestNotificationDTO> getManagerJoinRequestNotifications(
            UUID managerId, Pageable pageable) {
        Page<EventUser> pendingUsers = eventUserRepository.findPendingUsersByManagerId(
                managerId, EventUserStatus.PENDING, pageable);
        return pendingUsers.map(this::toManagerJoinRequestNotificationDTO);
    }

    @Cacheable(value = "managerEventNotificationCount", key = "#managerId", unless = "#result == 0")
    @Transactional(readOnly = true)
    public long countUnreadManagerEventNotifications(UUID managerId) {
        List<NotificationType> types = Arrays.asList(
                NotificationType.EVENT_APPROVED,
                NotificationType.EVENT_REJECTED
        );
        return notificationRepository.countUnreadManagerEventNotifications(managerId, types);
    }

    @Transactional(readOnly = true)
    public long countPendingJoinRequests(UUID managerId) {
        Page<EventUser> pendingUsers = eventUserRepository.findPendingUsersByManagerId(
                managerId, EventUserStatus.PENDING, Pageable.ofSize(1));
        return pendingUsers.getTotalElements();
    }

    @Transactional(readOnly = true)
    public Page<AdminRequestNotificationDTO> getAdminPendingRoleRequests(Pageable pageable) {
        Page<Request> requests = requestRepository.findByStatus(RequestStatus.WAITING, pageable);
        return requests.map(this::toAdminRequestNotificationDTO);
    }

    @Cacheable(value = "adminPendingRequestCount", unless = "#result == 0")
    @Transactional(readOnly = true)
    public long countAdminPendingRequests() {
        return requestRepository.countByStatus(RequestStatus.WAITING);
    }

    @Transactional(readOnly = true)
    public Page<UserRoleRequestNotificationDTO> getUserRoleRequestNotifications(
            UUID userId, Pageable pageable) {
        List<NotificationType> types = Arrays.asList(
                NotificationType.ROLE_REQUEST_APPROVED,
                NotificationType.ROLE_REQUEST_REJECTED
        );

        Page<Notification> notifications = notificationRepository.findUserRoleRequestNotifications(
                userId, types, pageable);

        return notifications.map(this::toUserRoleRequestNotificationDTO);
    }

    @Cacheable(value = "userRoleNotificationCount", key = "#userId", unless = "#result == 0")
    @Transactional(readOnly = true)
    public long countUnreadUserRoleRequestNotifications(UUID userId) {
        List<NotificationType> types = Arrays.asList(
                NotificationType.ROLE_REQUEST_APPROVED,
                NotificationType.ROLE_REQUEST_REJECTED
        );
        return notificationRepository.countUnreadUserRoleRequestNotifications(userId, types);
    }

    @Transactional(readOnly = true)
    public boolean isEventManager(UUID accountId) {
        return eventUserRepository.isEventManager(accountId);
    }
    private ManagerEventNotificationDTO toManagerEventNotificationDTO(Notification notification) {
        return ManagerEventNotificationDTO.builder()
                .notificationId(notification.getNotificationId())
                .type(notification.getNotificationType())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreateAt())
                .senderAccountId(notification.getSenderAccount() != null 
                        ? notification.getSenderAccount().getAccountId() : null)
                .senderUsername(notification.getSenderAccount() != null 
                        ? notification.getSenderAccount().getUsername() : null)
                .build();
    }

    private ManagerJoinRequestNotificationDTO toManagerJoinRequestNotificationDTO(EventUser eventUser) {
        String fullName = null;
        if (eventUser.getAccount() != null && eventUser.getAccount().getUserInfo() != null) {
            var userInfo = eventUser.getAccount().getUserInfo();
            String firstName = userInfo.getFirstName() != null ? userInfo.getFirstName() : "";
            String lastName = userInfo.getLastName() != null ? userInfo.getLastName() : "";
            fullName = (firstName + " " + lastName).trim();
            if (fullName.isEmpty()) {
                fullName = null;
            }
        }
        return ManagerJoinRequestNotificationDTO.builder()
                .eventId(eventUser.getEventId())
                .eventTitle(eventUser.getEvent() != null ? eventUser.getEvent().getTitle() : null)
                .requesterAccountId(eventUser.getAccountId())
                .requesterUsername(eventUser.getAccount() != null 
                        ? eventUser.getAccount().getUsername() : null)
                .requesterFullName(fullName)
                .requesterAvatarUrl(null) // UserInfo does not have avatarUrl field
                .status(eventUser.getStatus())
                .requestedAt(eventUser.getRegisteredAt())
                .build();
    }

    private AdminRequestNotificationDTO toAdminRequestNotificationDTO(Request request) {
        String fullName = null;
        if (request.getAccount() != null && request.getAccount().getUserInfo() != null) {
            var userInfo = request.getAccount().getUserInfo();
            String firstName = userInfo.getFirstName() != null ? userInfo.getFirstName() : "";
            String lastName = userInfo.getLastName() != null ? userInfo.getLastName() : "";
            fullName = (firstName + " " + lastName).trim();
            if (fullName.isEmpty()) {
                fullName = null;
            }
        }
        
        return AdminRequestNotificationDTO.builder()
                .requestId(request.getRequestId())
                .requesterAccountId(request.getAccount() != null 
                        ? request.getAccount().getAccountId() : null)
                .requesterUsername(request.getAccount() != null 
                        ? request.getAccount().getUsername() : null)
                .requesterFullName(fullName)
                .requesterEmail(request.getAccount() != null 
                        ? request.getAccount().getEmail() : null)
                .requesterAvatarUrl(null) // UserInfo does not have avatarUrl field
                .status(request.getStatus())
                .reason(request.getReason())
                .createdAt(request.getCreatedAt())
                .build();
    }

    private UserRoleRequestNotificationDTO toUserRoleRequestNotificationDTO(Notification notification) {
        return UserRoleRequestNotificationDTO.builder()
                .notificationId(notification.getNotificationId())
                .type(notification.getNotificationType())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreateAt())
                .adminAccountId(notification.getSenderAccount() != null 
                        ? notification.getSenderAccount().getAccountId() : null)
                .adminUsername(notification.getSenderAccount() != null 
                        ? notification.getSenderAccount().getUsername() : null)
                .build();
    }
}
