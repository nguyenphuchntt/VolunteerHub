package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.EventSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.specification.EventSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log
@Service
public class EventSearchService {
    private final EventRepository eventRepository;

    @Autowired
    public EventSearchService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
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
            builder.accountId(account.getAccountId());
        }
        return builder.build();
    }

    @Transactional
    public Optional<EventSearchDTO> findByEventID(Long eventID) {
        Optional<Event> event = eventRepository.findById(eventID);
        return event.map(value -> {
            Account account = value.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            return mapToEventSearchDTO(value, account, userInfo);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findEventBySpecification(EventSearchCriteriaDTO criteria, Pageable pageable) {
        Specification<Event> spec = EventSpecification.fromCriteria(criteria);
        Page<Event> eventPage = eventRepository.findAll(spec, pageable);
        return eventPage.map( event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            return mapToEventSearchDTO(event, account, userInfo);
        });
    }

}
