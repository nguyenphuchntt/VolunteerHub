package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventUser.*;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.EventUserId;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Log
@Service
public class EventUserWriteService {
    private final EventUserRepository eventUserRepository;
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public EventUserWriteService(EventUserRepository eventUserRepository,
                                 EventRepository eventRepository,
                                 AccountRepository accountRepository) {
        this.eventUserRepository = eventUserRepository;
        this.eventRepository = eventRepository;
        this.accountRepository = accountRepository;
    }

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
                .orElseThrow(() -> new ResourceNotFoundException("EventUser with accountId: " + accountId + " and eventId: " + eventId + " not found"));
    }

    private void validateTime(Event event, OffsetDateTime start, OffsetDateTime end) {
        if (start != null && end!= null) {
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
    public EventUserSearchDTO registerEventUser(Account account, Long eventId, EventUserRegisterDTO eventUserRegisterDTO) {
        Event event = eventRepository.findById(eventId).orElseThrow(() ->
                new ResourceNotFoundException("Event with id: " + eventId + " not found"));
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
        } else {
            builder.role(EventUserRole.ATTENDEE)
                    .status(EventUserStatus.PENDING);
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
        eventUserRepository.deleteByAccountIdAndEventId(account.getAccountId(), eventId);
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
        if (account.getAccountId().equals(event.getCreatedBy().getAccountId()) || eventUser.getRole().equals(EventUserRole.MANAGER)) {
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
                () -> new ResourceNotFoundException("Account with id: " + accountId + " not found")
        );
        Event event = eventRepository.findById(eventId).orElseThrow(() ->
                new ResourceNotFoundException("Event with id: " + eventId + " not found"));
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
        eventUserRepository.deleteByAccountIdAndEventId(accountId, eventId);
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
        if (accountId.equals(event.getCreatedBy().getAccountId()) || eventUser.getRole().equals(EventUserRole.MANAGER)) {
            eventUser.setStatus(EventUserStatus.APPROVED);
        } else {
            eventUser.setStatus(EventUserStatus.PENDING);
        }
        eventUserRepository.save(eventUser);
        UserInfo userInfo = account.getUserInfo();
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }

    @Transactional
    public EventUserSearchDTO updateRole(UUID accountId, Long eventId, EventUserRoleUpdateDTO role) {
        EventUser eventUser = findEventUser(accountId, eventId);
        if (role.getEventUserRole() != null) {
            eventUser.setRole(role.getEventUserRole());
        }
        eventUserRepository.save(eventUser);
        return mapToEventUserSearchDTO(eventUser, eventUser.getAccount(), eventUser.getAccount().getUserInfo(), eventUser.getEvent());
    }

    @Transactional
    public EventUserSearchDTO updateStatus(UUID accountId, Long eventId, EventUserStatusUpdateDTO status) {
        EventUser eventUser = findEventUser(accountId, eventId);
        if (status.getStatus() != null) {
            eventUser.setStatus(status.getStatus());
        }
        eventUserRepository.save(eventUser);
        return mapToEventUserSearchDTO(eventUser, eventUser.getAccount(), eventUser.getAccount().getUserInfo(), eventUser.getEvent());
    }

}

