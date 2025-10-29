package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventCreateDTO;
import com.uet.VolunteerHub.dto.EventSearchDTO;
import com.uet.VolunteerHub.dto.EventUpdateDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EventWriteService {
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;


    @Autowired
    public EventWriteService(EventRepository eventRepository, AccountRepository accountRepository) {
        this.eventRepository = eventRepository;
        this.accountRepository = accountRepository;
    }

    private EventSearchDTO mapToEventSearchDTO (Event event, Account account, UserInfo userInfo) {
        var builder = EventSearchDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .status(event.getStatus())
                .attendeeCount(event.getAttendeeCount())
                .createAt(event.getCreateAt())
                .startAt(event.getStartAt())
                .endAt(event.getEndAt())
                .category(event.getCategory())
                .location(event.getLocation());
        if (account != null) {
            builder.accountId(account.getAccountId())
                    .username(account.getUsername())
                    .email(account.getEmail());
        }
        if (userInfo != null) {
            builder.firstName(userInfo.getFirstName())
                    .lastName(userInfo.getLastName());
        }
        return builder.build();
    }

    private Event findEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event with id: " + eventId + " not found"));
    }

    @Transactional
    public EventSearchDTO updateEvent(Long eventId, EventUpdateDTO eventUpdateDTO) {
        Event event = findEvent(eventId);
        if (eventUpdateDTO.getTitle() != null) {
            event.setTitle(eventUpdateDTO.getTitle());
        }
        if (eventUpdateDTO.getDescription() != null) {
            event.setDescription(eventUpdateDTO.getDescription());
        }
        if (eventUpdateDTO.getStatus() != null) {
            event.setStatus(eventUpdateDTO.getStatus());
        }
        if (eventUpdateDTO.getAttendeeCount() != null) {
            event.setAttendeeCount(eventUpdateDTO.getAttendeeCount());
        }
        if (eventUpdateDTO.getEndAt() != null) {
            event.setEndAt(eventUpdateDTO.getEndAt());
        }
        if (eventUpdateDTO.getCategory() != null) {
            event.setCategory(eventUpdateDTO.getCategory());
        }
        if (eventUpdateDTO.getLocation() != null) {
            event.setLocation(eventUpdateDTO.getLocation());
        }
        if (eventUpdateDTO.getStartAt() != null) {
            event.setStartAt(eventUpdateDTO.getStartAt());
        }

        eventRepository.save(event);
        Account account = event.getCreatedBy();
        UserInfo userInfo = (account != null) ? account.getUserInfo() : null;

        return mapToEventSearchDTO(event, account, userInfo);
    }

    @Transactional
    public EventSearchDTO deleteEvent(Long eventId) {
        Event event = findEvent(eventId);
        eventRepository.delete(event);
        Account account = event.getCreatedBy();
        UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
        return mapToEventSearchDTO(event, account, userInfo);
    }

    @Transactional
    public EventSearchDTO createEvent(EventCreateDTO eventCreateDTO, UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(
                () -> new EntityNotFoundException("Account with id: " + accountId + " not found"));
        Event event = new Event();
        event.setTitle(eventCreateDTO.getTitle());
        event.setDescription(eventCreateDTO.getDescription());
        event.setEndAt(eventCreateDTO.getEndAt());
        event.setCategory(eventCreateDTO.getCategory());
        event.setLocation(eventCreateDTO.getLocation());
        event.setStartAt(eventCreateDTO.getStartAt());

        event.setCreatedBy(account);
        event.setStatus(EventStatus.SCHEDULED);
        event.setAttendeeCount(0);

        eventRepository.save(event);
        return mapToEventSearchDTO(event, account, account.getUserInfo());
    }

}
