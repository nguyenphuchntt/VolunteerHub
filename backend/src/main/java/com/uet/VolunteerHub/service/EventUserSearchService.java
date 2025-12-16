package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventUser.EventUserSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.specification.EventUserSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Log
@Service
public class EventUserSearchService {
    private final EventUserRepository eventUserRepository;

    @Autowired
    public EventUserSearchService(EventUserRepository eventUserRepository) {
        this.eventUserRepository = eventUserRepository;
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

    @Transactional
    public EventUserSearchDTO findByAccountIdAndEventId(UUID accountId, Long eventId) {
        Optional<EventUser> eventUser = eventUserRepository.findByAccountIdAndEventId(accountId, eventId);
        return eventUser.map(value -> {
            Account account = value.getAccount();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = value.getEvent();
            return mapToEventUserSearchDTO(value, account, userInfo, event);
        }).orElseThrow( () -> new ResourceNotFoundException("Event " + eventId + " not found for account " + accountId));
    }

    @Transactional
    public Page<EventUserSearchDTO> findByAccountId(UUID accountId, Pageable pageable) {
        Page<EventUser> eventUserPage = eventUserRepository.findByAccountId(accountId, pageable);
        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
        });
    }

    @Transactional
    public Page<EventUserSearchDTO> findByEventId(Long eventId, Pageable pageable) {
        Page<EventUser> eventUserPage = eventUserRepository.findByEventId(eventId, pageable);
        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
        });
    }

    @Transactional
    public Page<EventUserSearchDTO> findEventUsersBySpecification(EventUserSearchCriteriaDTO criteria, Pageable pageable) {
        Specification<EventUser> spec = EventUserSpecification.fromCriteria(criteria);
        Page<EventUser> eventUserPage = eventUserRepository.findAll(spec, pageable);
        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event);
        });
    }

}
