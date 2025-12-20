package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Event.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.dto.Event.EventSuggestionDTO;
import com.uet.VolunteerHub.entity.EventMedia;
import org.springframework.data.domain.PageRequest;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.repository.EventLikeRepository;
import com.uet.VolunteerHub.repository.EventMediaRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.specification.EventSpecification;
import com.uet.VolunteerHub.repository.specification.PublicEventSpecification;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log
@Service
@Transactional(readOnly = true)
public class EventSearchService {
    private final EventRepository eventRepository;
    private final EventLikeRepository eventLikeRepository;
    private final EventMediaRepository eventMediaRepository;
    private final EventUserRepository eventUserRepository;

    @Autowired
    public EventSearchService(EventRepository eventRepository, EventLikeRepository eventLikeRepository,
            EventMediaRepository eventMediaRepository, EventUserRepository eventUserRepository) {
        this.eventRepository = eventRepository;
        this.eventLikeRepository = eventLikeRepository;
        this.eventMediaRepository = eventMediaRepository;
        this.eventUserRepository = eventUserRepository;
    }

    /**
     * Batch fetch cover images for multiple events to avoid N+1 queries.
     * Returns a map of eventId -> coverImageUrl
     */
    private Map<Long, String> batchFetchCoverImages(List<Long> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return Collections.emptyMap();
        }
        List<EventMedia> mediaList = eventMediaRepository.findFirstMediaByEventIds(eventIds);
        return mediaList.stream()
                .collect(Collectors.toMap(
                        EventMedia::getEventId,
                        em -> em.getMedia() != null ? em.getMedia().getUrl() : null,
                        (existing, replacement) -> existing // Keep first if duplicates
                ));
    }

    /**
     * Fetch single cover image for one event (used for single event lookups)
     */
    private String fetchSingleCoverImage(Long eventId) {
        return eventMediaRepository
                .findFirstByEvent_EventIdOrderByMedia_UploadedAtAsc(eventId)
                .map(em -> em.getMedia().getUrl())
                .orElse(null);
    }

    /**
     * Map event to DTO with pre-fetched cover image URL
     */
    private EventSearchDTO mapToEventSearchDTO(Event event, Account account, UserInfo userInfo, String coverImageUrl) {
        var builder = EventSearchDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .slug(event.getSlug())
                .description(event.getDescription())
                .status(event.getStatus())
                .attendeeCount(event.getAttendeeCount())
                .createAt(event.getCreateAt())
                .startAt(event.getStartAt())
                .endAt(event.getEndAt())
                .category(event.getCategory())
                .location(event.getLocation())
                .likeCount(event.getLikeCount())
                .coverImageUrl(coverImageUrl);
        if (account != null) {
            builder.accountId(account.getAccountId());
        }
        return builder.build();
    }

    /**
     * Legacy method for single event - fetches cover image individually
     */
    private EventSearchDTO mapToEventSearchDTO(Event event, Account account, UserInfo userInfo) {
        String coverImageUrl = fetchSingleCoverImage(event.getEventId());
        return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
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
            if (event.get().getStatus() != null && (event.get().getStatus().equals(EventStatus.PENDING)
                    || event.get().getStatus().equals(EventStatus.CANCELLED))) {
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

        // Batch fetch cover images for all events in the page
        List<Long> eventIds = eventPage.getContent().stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventPage.map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findEventsByAccountId(UUID accountId, Pageable pageable) {
        Page<Event> eventPage = eventRepository.findAllByCreatedBy_AccountId(accountId, pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventPage.getContent().stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventPage.map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findPublicEventBySpecification(EventSearchCriteriaDTO criteria, Pageable pageable) {
        Specification<Event> spec = PublicEventSpecification.fromCriteria(criteria);
        Page<Event> eventPage = eventRepository.findAll(spec, pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventPage.getContent().stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventPage.map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findEventsLikedByAccount(UUID accountId, Pageable pageable) {
        var likePage = eventLikeRepository.findAllByAccountId(accountId, pageable);

        // Batch fetch cover images
        List<Long> eventIds = likePage.getContent().stream()
                .map(el -> el.getEvent().getEventId())
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return likePage.map(eventLike -> {
            Event event = eventLike.getEvent();
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    @Cacheable(value = "events", key = "'top5ByLike'")
    @Transactional
    public List<EventSearchDTO> findTop5EventsByLikeCount() {
        List<Event> events = eventRepository.findTop5ByOrderByLikeCountDesc();

        // Batch fetch cover images
        List<Long> eventIds = events.stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return events.stream().map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        }).toList();
    }

    @Transactional
    public List<EventSearchDTO> findAllEvents() {
        List<Event> events = eventRepository.findAll();

        // Batch fetch cover images
        List<Long> eventIds = events.stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return events.stream().map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        }).toList();
    }

    @Cacheable(value = "events", key = "'hot:' + #pageable.pageNumber + ':' + #pageable.pageSize")
    @Transactional
    public Page<EventSearchDTO> findHotEvents(Pageable pageable) {
        Page<Event> eventPage = eventRepository.findHotEvents(pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventPage.getContent().stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventPage.map(event -> {
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    @Transactional
    public Page<EventSearchDTO> findManagedEvents(UUID accountId, Pageable pageable) {
        var eventUserPage = eventUserRepository.findManagedEventsByAccountId(accountId, pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventUserPage.getContent().stream()
                .map(eu -> eu.getEvent().getEventId())
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUserPage.map(eventUser -> {
            Event event = eventUser.getEvent();
            Account account = event.getCreatedBy();
            UserInfo userInfo = (account != null) ? account.getUserInfo() : null;
            String coverImageUrl = coverImageMap.get(event.getEventId());
            return mapToEventSearchDTO(event, account, userInfo, coverImageUrl);
        });
    }

    /**
     * Get lightweight suggestions for autocomplete
     */
    @Cacheable(value = "suggestions", key = "#query.toLowerCase() + ':' + #limit")
    @Transactional
    public List<EventSuggestionDTO> getSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        List<Event> events = eventRepository.findSuggestionsByTitle(query.trim(), PageRequest.of(0, limit));

        // Batch fetch cover images
        List<Long> eventIds = events.stream()
                .map(Event::getEventId)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return events.stream()
                .map(event -> EventSuggestionDTO.builder()
                        .eventId(event.getEventId())
                        .title(event.getTitle())
                        .category(event.getCategory())
                        .coverImageUrl(coverImageMap.get(event.getEventId()))
                        .build())
                .toList();
    }

}
