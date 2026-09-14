package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.EventUser.EventUserSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.*;
import com.uet.VolunteerHub.entity.Profile;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.EventMediaRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.specification.EventUserSpecification;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log
@Service
@Transactional(readOnly = true)
public class EventUserSearchService {
    private final EventUserRepository eventUserRepository;
    private final EventMediaRepository eventMediaRepository;

    @Autowired
    public EventUserSearchService(EventUserRepository eventUserRepository, EventMediaRepository eventMediaRepository) {
        this.eventUserRepository = eventUserRepository;
        this.eventMediaRepository = eventMediaRepository;
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
                        em -> em.getMedia() != null ? mediaDownloadUrl(em.getMedia()) : null,
                        (existing, replacement) -> existing // Keep first if duplicates
                ));
    }

    /**
     * Map EventUser to DTO with pre-fetched cover image URL
     */
    private EventUserSearchDTO mapToEventUserSearchDTO(EventUser eventUser, Account account,
                                                       Profile userInfo, Event event, String coverImageUrl) {
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
                    .eventStatus(event.getStatus())
                    .coverImageUrl(coverImageUrl)
                    .eventStartAt(event.getStartAt())
                    .eventEndAt(event.getEndAt());
        }
        return builder.build();
    }

    /**
     * Fetch single cover image for one event (used for single event lookups)
     */
    private String fetchSingleCoverImage(Long eventId) {
        return eventMediaRepository
                .findFirstByEvent_EventIdOrderByMedia_CreatedAtAsc(eventId)
                .map(em -> mediaDownloadUrl(em.getMedia()))
                .orElse(null);
    }

    private String mediaDownloadUrl(Media media) {
        return "/api/media/download/" + media.getStorageKey();
    }

    public EventUserSearchDTO findByAccountIdAndEventId(UUID accountId, Long eventId) {
        Optional<EventUser> eventUser = eventUserRepository.findByAccountIdAndEventId(accountId, eventId);
        return eventUser.map(value -> {
            Account account = value.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = value.getEvent();
            String coverImageUrl = event != null ? fetchSingleCoverImage(event.getEventId()) : null;
            return mapToEventUserSearchDTO(value, account, userInfo, event, coverImageUrl);
        }).orElseThrow(() -> new ResourceNotFoundException("Event " + eventId + " not found for account " + accountId));
    }

    public Page<EventUserSearchDTO> findByAccountId(UUID accountId, Pageable pageable) {
        return findByAccountId(accountId, null, pageable);
    }

    public Page<EventUserSearchDTO> findByAccountId(UUID accountId, EventUserStatus status, Pageable pageable) {
        Page<EventUser> eventUserPage;
        if (status != null) {
            eventUserPage = eventUserRepository.findByAccountIdAndStatus(accountId, status, pageable);
        } else {
            eventUserPage = eventUserRepository.findByAccountId(accountId, pageable);
        }

        // Batch fetch cover images for all events in the page
        List<Long> eventIds = eventUserPage.getContent().stream()
                .map(eu -> eu.getEvent() != null ? eu.getEvent().getEventId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            String coverImageUrl = event != null ? coverImageMap.get(event.getEventId()) : null;
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        });
    }

    public Page<EventUserSearchDTO> findByEventId(Long eventId, Pageable pageable) {
        Page<EventUser> eventUserPage = eventUserRepository.findByEventId(eventId, pageable);

        // For single event, just fetch once
        String coverImageUrl = fetchSingleCoverImage(eventId);

        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        });
    }

    public Page<EventUserSearchDTO> findApprovedByEventId(Long eventId, Pageable pageable) {
        // Only return APPROVED participants (for public access)
        Page<EventUser> eventUserPage = eventUserRepository.findByEventIdAndStatus(eventId, EventUserStatus.APPROVED,
                pageable);

        // For single event, just fetch once
        String coverImageUrl = fetchSingleCoverImage(eventId);

        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        });
    }

    public Page<EventUserSearchDTO> findEventUsersBySpecification(EventUserSearchCriteriaDTO criteria,
            Pageable pageable) {
        Specification<EventUser> spec = EventUserSpecification.fromCriteria(criteria);
        Page<EventUser> eventUserPage = eventUserRepository.findAll(spec, pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventUserPage.getContent().stream()
                .map(eu -> eu.getEvent() != null ? eu.getEvent().getEventId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            String coverImageUrl = event != null ? coverImageMap.get(event.getEventId()) : null;
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        });
    }

    public List<EventUserSearchDTO> findAllEventUsers() {
        List<EventUser> eventUsers = eventUserRepository.findAll();

        // Batch fetch cover images
        List<Long> eventIds = eventUsers.stream()
                .map(eu -> eu.getEvent() != null ? eu.getEvent().getEventId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUsers.stream().map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            String coverImageUrl = event != null ? coverImageMap.get(event.getEventId()) : null;
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        }).toList();
    }

    public List<EventUserSearchDTO> findAllEventUsersByEventId(Long eventId) {
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);

        // For single event, just fetch once
        String coverImageUrl = fetchSingleCoverImage(eventId);

        return eventUsers.stream().map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        }).toList();
    }

    public List<EventUserSearchDTO> findAllEventUsersByAccountId(UUID accountId) {
        List<EventUser> eventUsers = eventUserRepository.findByAccountId(accountId);

        // Batch fetch cover images
        List<Long> eventIds = eventUsers.stream()
                .map(eu -> eu.getEvent() != null ? eu.getEvent().getEventId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUsers.stream().map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            String coverImageUrl = event != null ? coverImageMap.get(event.getEventId()) : null;
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        }).toList();
    }

    public Page<EventUserSearchDTO> findPendingUsersByManagerId(UUID managerId, Pageable pageable) {
        Page<EventUser> eventUserPage = eventUserRepository.findPendingUsersByManagerId(
                managerId,
                EventUserStatus.PENDING,
                pageable);

        // Batch fetch cover images
        List<Long> eventIds = eventUserPage.getContent().stream()
                .map(eu -> eu.getEvent() != null ? eu.getEvent().getEventId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());
        Map<Long, String> coverImageMap = batchFetchCoverImages(eventIds);

        return eventUserPage.map(eventUser -> {
            Account account = eventUser.getAccount();
            Profile userInfo = (account != null) ? account.getUserInfo() : null;
            Event event = eventUser.getEvent();
            String coverImageUrl = event != null ? coverImageMap.get(event.getEventId()) : null;
            return mapToEventUserSearchDTO(eventUser, account, userInfo, event, coverImageUrl);
        });
    }
}
