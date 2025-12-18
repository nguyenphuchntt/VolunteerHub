package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Event.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.repository.EventLikeRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.specification.EventSpecification;
import com.uet.VolunteerHub.repository.specification.PublicEventSpecification;
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
public class EventSearchService {
    private final EventRepository eventRepository;
    private final EventLikeRepository eventLikeRepository;

    @Autowired
    public EventSearchService(EventRepository eventRepository, EventLikeRepository eventLikeRepository) {
        this.eventRepository = eventRepository;
        this.eventLikeRepository = eventLikeRepository;
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
                .location(event.getLocation())
                .likeCount(event.getLikeCount());
        if (event.getMedia() != null && !event.getMedia().isEmpty()) {
             event.getMedia().stream()
                 .map(com.uet.VolunteerHub.entity.EventMedia::getMedia)
                 .max((m1, m2) -> m1.getUploadedAt().compareTo(m2.getUploadedAt()))
                 .ifPresent(latestMedia -> builder.coverImage(latestMedia.getUrl()));
        }

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
    public Optional<EventSearchDTO> findByEventID(Long eventID, UUID accountId) {
        Optional<Event> event = eventRepository.findById(eventID);
        if (event.isPresent() && !event.get().getCreatedBy().getAccountId().equals(accountId)) {
            if (event.get().getStatus() != null && (event.get().getStatus().equals(EventStatus.PENDING) || event.get().getStatus().equals(EventStatus.CANCELLED))) {
                return Optional.empty();
            }
        }
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

    @Transactional
    public Page<EventSearchDTO> findEventsByAccountId(UUID accountId, Pageable pageable) {
        Page<Event> eventPage = eventRepository.findAllByCreatedBy_AccountId(accountId, pageable);
        return eventPage.map( event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            return mapToEventSearchDTO(event, account, userInfo);
        });

    }

    @Transactional
    public Page<EventSearchDTO> findPublicEventBySpecification(EventSearchCriteriaDTO criteria, Pageable pageable) {
        Specification<Event> spec = PublicEventSpecification.fromCriteria(criteria);
        Page<Event> eventPage = eventRepository.findAll(spec, pageable);
        return eventPage.map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            return mapToEventSearchDTO(event, account, userInfo);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findEventsLikedByAccount(UUID accountId, Pageable pageable) {
        return eventLikeRepository.findAllByAccountId(accountId, pageable)
                .map(eventLike -> {
                    Event event = eventLike.getEvent();
                    Account account = event.getCreatedBy();
                    UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
                    return mapToEventSearchDTO(event, account, userInfo);
                });
    }

}
