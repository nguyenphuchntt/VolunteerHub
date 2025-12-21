package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventUser.*;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.entity.EventUserId;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.events.event.EventJoinApprovedEvent;
import com.uet.VolunteerHub.events.event.EventJoinRejectedEvent;
import com.uet.VolunteerHub.events.event.EventJoinRequestEvent;
import com.uet.VolunteerHub.events.event.EventManagerPromotedEvent;
import com.uet.VolunteerHub.events.event.EventManagerDemotedEvent;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log
@Service
@RequiredArgsConstructor
public class EventUserWriteService {
    private final EventUserRepository eventUserRepository;
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;
    private final PushNotificationService pushNotificationService;
    private final ApplicationEventPublisher eventPublisher;

    private EventUserSearchDTO mapToEventUserSearchDTO(EventUser eventUser, Account account,
            UserInfo userInfo, Event event) {
        var builder = EventUserSearchDTO.builder()
                .accountId(eventUser.getAccountId())
                .eventId(eventUser.getEventId())
                .registeredAt(eventUser.getRegisteredAt())
                .startAt(eventUser.getStartAt())
                .endAt(eventUser.getEndAt())
                .status(eventUser.getStatus())
                .role(eventUser.getRole());
        if (account != null) {
            builder.username(account.getUsername())
                    .email(account.getEmail());
        }
        if (userInfo != null) {
            builder.firstName(userInfo.getFirstName())
                    .lastName(userInfo.getLastName());
        }
        if (event != null) {
            builder.title(event.getTitle())
                    .description(event.getDescription())
                    .location(event.getLocation())
                    .eventStatus(event.getStatus());
        }
        return builder.build();
    }

    private EventUser findEventUser(UUID accountId, Long eventId) {
        EventUserId eventUserId = new EventUserId();
        eventUserId.setAccountId(accountId);
        eventUserId.setEventId(eventId);
        return eventUserRepository.findById(eventUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "EventUser with accountId: " + accountId + " and eventId: " + eventId + " not found"));
    }

    private void validateTime(Event event, OffsetDateTime start, OffsetDateTime end) {
        if (start != null && end != null) {
            if (start.isAfter(end)) {
                throw new IllegalArgumentException("Start must be before end time");
            }
        }
        if (start != null && start.isAfter(event.getEndAt())) {
            throw new IllegalArgumentException("Start time must be before or the same as event end time");
        }
        if (end != null && end.isAfter(event.getEndAt())) {
            throw new IllegalArgumentException("End time must be before or the same as event end time");
        }
    }

    @Transactional
    public EventUserSearchDTO registerEventUser(Account account, Long eventId,
            EventUserRegisterDTO eventUserRegisterDTO) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id: " + eventId + " not found"));
        if (eventUserRegisterDTO.getStartAt() == null) {
            eventUserRegisterDTO.setStartAt(event.getStartAt());
        }
        if (eventUserRegisterDTO.getEndAt() == null) {
            eventUserRegisterDTO.setEndAt(event.getEndAt());
        }
        validateTime(event, eventUserRegisterDTO.getStartAt(), eventUserRegisterDTO.getEndAt());
        var builder = EventUser.builder()
                .accountId(account.getAccountId())
                .eventId(eventId)
                .startAt(eventUserRegisterDTO.getStartAt())
                .endAt(eventUserRegisterDTO.getEndAt())
                .account(account)
                .event(event);
        if (account.getAccountId().equals(event.getCreatedBy().getAccountId())) {
            builder.role(EventUserRole.MANAGER)
                    .status(EventUserStatus.APPROVED);

            // Increment attendeeCount for manager (creator)
            event.setAttendeeCount(event.getAttendeeCount() + 1);
            eventRepository.save(event);
        } else {
            builder.role(EventUserRole.ATTENDEE)
                    .status(EventUserStatus.PENDING);
            // Notify all managers of this event about the new join request
            List<Account> eventManagers = accountRepository.findEventManagersByEventId(eventId);
            eventPublisher.publishEvent(new EventJoinRequestEvent(this, account, event, eventManagers));
        }
        EventUser eventUser = eventUserRepository.save(builder.build());

        return mapToEventUserSearchDTO(eventUser, account, account.getUserInfo(), event);
    }

    @Transactional
    public void deleteEventUser(Account account, Long eventId) {
        if (!accountRepository.existsById(account.getAccountId())) {
            throw new ResourceNotFoundException("Account with id: " + account.getAccountId() + " not found");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id: " + eventId + " not found");
        }

        EventUser eventUser = findEventUser(account.getAccountId(), eventId);

        if (eventUser.getRole() == EventUserRole.MANAGER) {
            long managerCount = eventUserRepository.countByEventIdAndRole(eventId, EventUserRole.MANAGER);

            if (managerCount <= 1) {
                throw new IllegalStateException(
                        "Cannot unregister. You are the last manager of this event. " +
                                "Please assign another manager before leaving.");
            }
        }

        if (eventUser.getStatus() == EventUserStatus.APPROVED) {
            Event event = eventUser.getEvent();
            event.setAttendeeCount(Math.max(0, event.getAttendeeCount() - 1));
            eventRepository.save(event);
        }

        eventUserRepository.delete(eventUser);
    }

    @Transactional
    public EventUserSearchDTO updateEventUser(Account account, Long eventId, EventUserUpdateDTO updateDTO) {
        if (!accountRepository.existsById(account.getAccountId())) {
            throw new ResourceNotFoundException("Account with id: " + account.getAccountId() + " not found");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id: " + eventId + " not found");
        }
        EventUser eventUser = findEventUser(account.getAccountId(), eventId);
        Event event = eventUser.getEvent();
        if (updateDTO.getStartAt() != null) {
            eventUser.setStartAt(updateDTO.getStartAt());
        }
        if (updateDTO.getEndAt() != null) {
            eventUser.setEndAt(updateDTO.getEndAt());
        }
        validateTime(event, updateDTO.getStartAt(), updateDTO.getEndAt());
        if (account.getAccountId().equals(event.getCreatedBy().getAccountId())
                || eventUser.getRole().equals(EventUserRole.MANAGER)) {
            eventUser.setStatus(EventUserStatus.APPROVED);
        } else {
            eventUser.setStatus(EventUserStatus.PENDING);
        }
        eventUserRepository.save(eventUser);
        UserInfo userInfo = account.getUserInfo();
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }

    @Transactional
    public EventUserSearchDTO createEventUser(UUID accountId, Long eventId, EventUserCreateDTO eventUserCreateDTO) {
        Account account = accountRepository.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account with id: " + accountId + " not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id: " + eventId + " not found"));
        if (eventUserCreateDTO.getStartAt() == null) {
            eventUserCreateDTO.setStartAt(event.getStartAt());
        }
        if (eventUserCreateDTO.getEndAt() == null) {
            eventUserCreateDTO.setEndAt(event.getEndAt());
        }
        validateTime(event, eventUserCreateDTO.getStartAt(), eventUserCreateDTO.getEndAt());
        var builder = EventUser.builder()
                .accountId(account.getAccountId())
                .eventId(eventId)
                .startAt(eventUserCreateDTO.getStartAt())
                .endAt(eventUserCreateDTO.getEndAt())
                .account(account)
                .event(event);
        if (eventUserCreateDTO.getRole() != null) {
            builder.role(eventUserCreateDTO.getRole());
        } else {
            builder.role(EventUserRole.ATTENDEE);
        }
        if (eventUserCreateDTO.getStatus() != null) {
            builder.status(eventUserCreateDTO.getStatus());
        } else {
            builder.status(EventUserStatus.PENDING);
        }
        EventUser eventUser = eventUserRepository.save(builder.build());
        return mapToEventUserSearchDTO(eventUser, account, account.getUserInfo(), event);
    }

    @Transactional
    public void deleteEventUser(UUID accountId, Long eventId) {
        if (!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account with id: " + accountId + " not found");
        }
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id: " + eventId + " not found");
        }

        EventUser eventUser = findEventUser(accountId, eventId);

        if (eventUser.getRole() == EventUserRole.MANAGER) {
            long managerCount = eventUserRepository.countByEventIdAndRole(eventId, EventUserRole.MANAGER);

            if (managerCount <= 1) {
                throw new IllegalStateException(
                        "Cannot remove this user. They are the last manager of this event. " +
                                "Please assign another manager before removing them.");
            }
        }

        // Decrement attendeeCount if deleted user was APPROVED
        if (eventUser.getStatus() == EventUserStatus.APPROVED) {
            Event event = eventUser.getEvent();
            event.setAttendeeCount(Math.max(0, event.getAttendeeCount() - 1));
            eventRepository.save(event);
        }

        eventUserRepository.delete(eventUser);
    }

    @Transactional
    public EventUserSearchDTO updateEventUser(UUID accountId, Long eventId, EventUserUpdateDTO updateDTO) {
        EventUser eventUser = findEventUser(accountId, eventId);
        Event event = eventUser.getEvent();
        Account account = eventUser.getAccount();
        if (updateDTO.getStartAt() != null) {
            eventUser.setStartAt(updateDTO.getStartAt());
        }
        if (updateDTO.getEndAt() != null) {
            eventUser.setEndAt(updateDTO.getEndAt());
        }
        validateTime(event, updateDTO.getStartAt(), updateDTO.getEndAt());
        if (accountId.equals(event.getCreatedBy().getAccountId())
                || eventUser.getRole().equals(EventUserRole.MANAGER)) {
            eventUser.setStatus(EventUserStatus.APPROVED);
        } else {
            eventUser.setStatus(EventUserStatus.PENDING);
        }
        eventUserRepository.save(eventUser);
        UserInfo userInfo = account.getUserInfo();
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }

    @CacheEvict(value = "managerDashboard", allEntries = true)
    @Transactional
    public EventUserSearchDTO updateRole(UUID accountId, Long eventId, EventUserRoleUpdateDTO role, Account caller) {
        EventUser eventUser = findEventUser(accountId, eventId);
        EventUserRole currRole = eventUser.getRole();
        Event event = eventUser.getEvent();

        if (accountId.equals(event.getCreatedBy().getAccountId())) {
            boolean isSelf = caller.getAccountId().equals(accountId);
            boolean isAdmin = caller.getRole() == UserRole.ADMIN;
            boolean isDemoting = role.getEventUserRole() == EventUserRole.ATTENDEE;

            if (isDemoting && !isSelf && !isAdmin) {
                throw new IllegalArgumentException("Cannot remove manager role from the Event Creator.");
            }
        }
        boolean isSelfAction = caller.getAccountId().equals(accountId);
        boolean isAdmin = caller.getRole() == UserRole.ADMIN;
        boolean isDemotingFromManager = eventUser.getRole() == EventUserRole.MANAGER 
                && role.getEventUserRole() == EventUserRole.ATTENDEE;
        
        if (isSelfAction && isDemotingFromManager && !isAdmin) {
            throw new com.uet.VolunteerHub.exception.SelfRoleChangeException(
                "You cannot demote yourself from Manager to Attendee. Please contact another manager or admin.");
        }

        // If demoting a manager, ensure at least one manager remains
        if (eventUser.getRole() == EventUserRole.MANAGER &&
                role.getEventUserRole() != null &&
                role.getEventUserRole() != EventUserRole.MANAGER) {

            long managerCount = eventUserRepository.countByEventIdAndRole(eventId, EventUserRole.MANAGER);

            if (managerCount <= 1) {
                throw new IllegalStateException(
                        "Cannot remove manager role. This user is the last manager of the event.");
            }
        }

        if (role.getEventUserRole() != null) {
            eventUser.setRole(role.getEventUserRole());
        }
        eventUserRepository.save(eventUser);
        if (role.getEventUserRole() == EventUserRole.MANAGER && (eventUser.getRole() != currRole)) {
            pushNotificationService.pushNotificationToUser(accountId,
                    "Bạn được duyệt làm quản lý của sự kiện: " + eventUser.getEvent().getTitle());
            eventPublisher.publishEvent(new EventManagerPromotedEvent(this, caller, event, eventUser.getAccount()));
        }
        if (role.getEventUserRole() == EventUserRole.ATTENDEE && (eventUser.getRole() != currRole)) {
            pushNotificationService.pushNotificationToUser(accountId,
                    "Bạn bị thay đổi là người tham gia sự kiện: " + eventUser.getEvent().getTitle());
            eventPublisher.publishEvent(new EventManagerDemotedEvent(this, caller, event, eventUser.getAccount()));
        }
        return mapToEventUserSearchDTO(eventUser, eventUser.getAccount(), eventUser.getAccount().getUserInfo(),
                eventUser.getEvent());
    }

    @CacheEvict(value = "managerDashboard", allEntries = true)
    @Transactional
    public EventUserSearchDTO updateStatus(UUID accountId, Long eventId, EventUserStatusUpdateDTO status) {
        EventUser eventUser = findEventUser(accountId, eventId);
        EventUserStatus oldStatus = eventUser.getStatus();
        EventUserStatus newStatus = status.getStatus();

        if (newStatus != null && newStatus != oldStatus) {
            eventUser.setStatus(newStatus);

            // Update attendeeCount when status changes to/from APPROVED
            Event event = eventUser.getEvent();

            if (newStatus == EventUserStatus.APPROVED && oldStatus != EventUserStatus.APPROVED) {
                // User newly approved - increment count
                event.setAttendeeCount(event.getAttendeeCount() + 1);
                eventRepository.save(event);
                pushNotificationService.pushNotificationToUser(accountId,
                        "Bạn đã được duyệt để tham gia sự kiện: " + event.getTitle());
                Account manager = event.getCreatedBy();
                eventPublisher.publishEvent(
                        new EventJoinApprovedEvent(this, manager, event, List.of(eventUser.getAccount())));
            } else if (oldStatus == EventUserStatus.APPROVED &&
                    newStatus != EventUserStatus.APPROVED &&
                    newStatus != EventUserStatus.FINISHED &&
                    newStatus != EventUserStatus.UNFINISHED) {
                // User was approved but now is rejected/pending - decrement count and notify
                event.setAttendeeCount(Math.max(0, event.getAttendeeCount() - 1));
                eventRepository.save(event);
                pushNotificationService.pushNotificationToUser(accountId,
                        "Bạn không được duyệt tham gia sự kiện: " + event.getTitle());
                Account manager = event.getCreatedBy();
                eventPublisher.publishEvent(
                        new EventJoinRejectedEvent(this, manager, event, List.of(eventUser.getAccount())));
            } else if (oldStatus == EventUserStatus.APPROVED &&
                    (newStatus == EventUserStatus.FINISHED || newStatus == EventUserStatus.UNFINISHED)) {
                // User finished/unfinished - decrement count but don't send rejected message
                event.setAttendeeCount(Math.max(0, event.getAttendeeCount() - 1));
                eventRepository.save(event);
            }
        }
        eventUserRepository.save(eventUser);
        if (newStatus == EventUserStatus.FINISHED) {
            pushNotificationService.pushNotificationToUser(accountId,
                    "Bạn đã được đánh dấu hoàn thành sự kiện: " + eventUser.getEvent().getTitle());
        }
        if (newStatus == EventUserStatus.UNFINISHED) {
            pushNotificationService.pushNotificationToUser(accountId,
                    "Bạn không được đánh dấu hoàn thành sự kiện " + eventUser.getEvent().getTitle());
        }
        return mapToEventUserSearchDTO(eventUser, eventUser.getAccount(), eventUser.getAccount().getUserInfo(),
                eventUser.getEvent());
    }

    @Caching(evict = {
            @CacheEvict(value = "managerDashboard", allEntries = true),
            @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public Map<String, Object> bulkApprove(Long eventId, List<UUID> accountIds) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id: " + eventId + " not found");
        }
        Event event = eventRepository.findById(eventId).orElseThrow();
        List<UUID> approvedAccountIds = new ArrayList<>();

        for (UUID accountId : accountIds) {
            EventUserId eventUserId = new EventUserId();
            eventUserId.setAccountId(accountId);
            eventUserId.setEventId(eventId);

            EventUser eventUser = eventUserRepository.findById(eventUserId).orElse(null);

            if (eventUser != null && eventUser.getStatus() != EventUserStatus.APPROVED) {
                eventUser.setStatus(EventUserStatus.APPROVED);
                eventUserRepository.save(eventUser);

                event.setAttendeeCount(event.getAttendeeCount() + 1);
                approvedAccountIds.add(accountId);
            }
        }
        eventRepository.save(event);

        if (!approvedAccountIds.isEmpty()) {
            // Send push notifications to approved users
            pushNotificationService.pushNotificationToMultipleUsers(
                    approvedAccountIds,
                    "Bạn đã được duyệt để tham gia sự kiện: " + event.getTitle());

            // Get approved user accounts and publish event for in-app notifications
            List<Account> approvedUsers = accountRepository.findAllById(approvedAccountIds);
            // Use first manager or event creator as the actor
            Account manager = event.getCreatedBy();
            eventPublisher.publishEvent(new EventJoinApprovedEvent(this, manager, event, approvedUsers));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", approvedAccountIds.size());
        return response;
    }

    @Caching(evict = {
            @CacheEvict(value = "managerDashboard", allEntries = true),
            @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public Map<String, Object> bulkReject(Long eventId, List<UUID> accountIds) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event with id: " + eventId + " not found");
        }
        Event event = eventRepository.findById(eventId).orElseThrow();
        List<UUID> rejectedAccountIds = new ArrayList<>();

        for (UUID accountId : accountIds) {
            EventUserId eventUserId = new EventUserId();
            eventUserId.setAccountId(accountId);
            eventUserId.setEventId(eventId);

            EventUser eventUser = eventUserRepository.findById(eventUserId).orElse(null);

            if (eventUser != null && eventUser.getStatus() != EventUserStatus.REJECTED) {

                if (eventUser.getStatus() == EventUserStatus.APPROVED) {
                    event.setAttendeeCount(Math.max(0, event.getAttendeeCount() - 1));
                }

                eventUser.setStatus(EventUserStatus.REJECTED);
                eventUserRepository.save(eventUser);
                rejectedAccountIds.add(accountId);
            }
        }
        eventRepository.save(event);

        if (!rejectedAccountIds.isEmpty()) {
            // Send push notifications to rejected users
            pushNotificationService.pushNotificationToMultipleUsers(
                    rejectedAccountIds,
                    "Bạn không được duyệt tham gia sự kiện: " + event.getTitle());

            // Get rejected user accounts and publish event for in-app notifications
            List<Account> rejectedUsers = accountRepository.findAllById(rejectedAccountIds);
            // Use first manager or event creator as the actor
            Account manager = event.getCreatedBy();
            eventPublisher.publishEvent(new EventJoinRejectedEvent(this, manager, event, rejectedUsers));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", rejectedAccountIds.size());
        return response;
    }
}
