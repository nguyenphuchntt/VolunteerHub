package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventUserCreateDTO;
import com.uet.VolunteerHub.dto.EventUserSearchDTO;
import com.uet.VolunteerHub.dto.EventUserUpdateDTO;
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
import com.uet.VolunteerHub.exception.ResourceAlreadyExistsException;
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

    @Transactional
    public EventUserSearchDTO createEventUser(EventUserCreateDTO createDTO) {
        Event event = eventRepository.findById(createDTO.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event with id: " + createDTO.getEventId() + " not found"));

        Account account = accountRepository.findById(createDTO.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account with id: " + createDTO.getAccountId() + " not found"));

        EventUserId eventUserId = new EventUserId();
        eventUserId.setAccountId(createDTO.getAccountId());
        eventUserId.setEventId(createDTO.getEventId());
        
        if (eventUserRepository.existsById(eventUserId)) {
            throw new ResourceAlreadyExistsException("EventUser with accountId: " + createDTO.getAccountId() + " and eventId: " + createDTO.getEventId() + " already exists");
        }

        OffsetDateTime startAt = createDTO.getStartAt() != null ? createDTO.getStartAt() : event.getStartAt();
        OffsetDateTime endAt = createDTO.getEndAt() != null ? createDTO.getEndAt() : event.getEndAt();

        EventUser eventUser = EventUser.builder()
                .accountId(createDTO.getAccountId())
                .eventId(createDTO.getEventId())
                .status(EventUserStatus.PENDING)
                .role(EventUserRole.ATTENDEE)
                .startAt(startAt)
                .endAt(endAt)
                .account(account)
                .event(event)
                .build();

        eventUserRepository.save(eventUser);
        UserInfo userInfo = account.getUserInfo();
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }

    @Transactional
    public EventUserSearchDTO updateEventUser(UUID accountId, Long eventId, EventUserUpdateDTO updateDTO) {
        EventUser eventUser = findEventUser(accountId, eventId);

        if (updateDTO.getStartAt() != null) {
            eventUser.setStartAt(updateDTO.getStartAt());
        }
        if (updateDTO.getEndAt() != null) {
            eventUser.setEndAt(updateDTO.getEndAt());
        }

        eventUser.setStatus(EventUserStatus.PENDING);

        eventUserRepository.save(eventUser);
        Account account = eventUser.getAccount();
        UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
        Event event = eventUser.getEvent();
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }

    @Transactional
    public EventUserSearchDTO deleteEventUser(UUID accountId, Long eventId) {
        EventUser eventUser = findEventUser(accountId, eventId);
        Account account = eventUser.getAccount();
        UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
        Event event = eventUser.getEvent();
        
        eventUserRepository.delete(eventUser);
        return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
    }
}

