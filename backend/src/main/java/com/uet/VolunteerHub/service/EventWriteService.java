package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Event.*;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.util.SlugUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class EventWriteService {
    private final EventRepository eventRepository;

    @Autowired
    public EventWriteService(EventRepository eventRepository, AccountRepository accountRepository) {
        this.eventRepository = eventRepository;
    }

    private EventSearchDTO mapToEventSearchDTO(Event event, Account account) {
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
        if (account != null) {
            builder.accountId(account.getAccountId());
        }
        return builder.build();
    }

    private Event findEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id: " + eventId + " not found"));
    }

    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = findEvent(eventId);
        eventRepository.delete(event);
    }

    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO registerEvent(Account account, EventManagerCreateDTO eventManagerCreateDTO) {
        if (eventManagerCreateDTO.getStartAt() != null && eventManagerCreateDTO.getEndAt() != null) {
            if (eventManagerCreateDTO.getStartAt().isAfter(eventManagerCreateDTO.getEndAt())) {
                throw new IllegalArgumentException("Start and end time must be greater than or equal to end time.");
            }
        }
        if (eventManagerCreateDTO.getAttendeeCount() < 0) {
            throw new IllegalArgumentException("Attendee count must be greater than or equal to 0.");
        }
        var builder = Event.builder();
        builder.createdBy(account)
                .title(eventManagerCreateDTO.getTitle());
        if (eventManagerCreateDTO.getDescription() != null) {
            builder.description(eventManagerCreateDTO.getDescription());
        }
        if (eventManagerCreateDTO.getStartAt() != null) {
            builder.startAt(eventManagerCreateDTO.getStartAt());
        } else {
            builder.startAt(OffsetDateTime.now());
        }
        if (eventManagerCreateDTO.getEndAt() != null) {
            builder.endAt(eventManagerCreateDTO.getEndAt());
        } else {
            builder.endAt(OffsetDateTime.now());
        }
        if (eventManagerCreateDTO.getCategory() != null) {
            builder.category(eventManagerCreateDTO.getCategory());
        }
        if (eventManagerCreateDTO.getLocation() != null) {
            builder.location(eventManagerCreateDTO.getLocation());
        }
        if (eventManagerCreateDTO.getAttendeeCount() != 0) {
            builder.attendeeCount(eventManagerCreateDTO.getAttendeeCount());
        }
        builder.likeCount(0);
        builder.status(EventStatus.PENDING);
        Event event = builder.build();
        // Generate slug from title
        event.setSlug(SlugUtils.generateSlug(event.getTitle()));
        eventRepository.save(event);
        return mapToEventSearchDTO(event, account);
    }

    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO createEvent(Account account, EventAdminCreateDTO eventAdminCreateDTO) {
        if (eventAdminCreateDTO.getStartAt() != null && eventAdminCreateDTO.getEndAt() != null) {
            if (eventAdminCreateDTO.getStartAt().isAfter(eventAdminCreateDTO.getEndAt())) {
                throw new IllegalArgumentException("Start and end time must be greater than or equal to end time.");
            }
        }
        if (eventAdminCreateDTO.getAttendeeCount() < 0) {
            throw new IllegalArgumentException("Attendee count must be greater than or equal to 0.");
        }
        var builder = Event.builder();
        builder.createdBy(account)
                .title(eventAdminCreateDTO.getTitle());
        if (eventAdminCreateDTO.getDescription() != null) {
            builder.description(eventAdminCreateDTO.getDescription());
        }
        if (eventAdminCreateDTO.getStartAt() != null) {
            builder.startAt(eventAdminCreateDTO.getStartAt());
        } else {
            builder.startAt(OffsetDateTime.now());
        }
        if (eventAdminCreateDTO.getEndAt() != null) {
            builder.endAt(eventAdminCreateDTO.getEndAt());
        } else {
            builder.endAt(OffsetDateTime.now());
        }
        if (eventAdminCreateDTO.getCategory() != null) {
            builder.category(eventAdminCreateDTO.getCategory());
        }
        if (eventAdminCreateDTO.getLocation() != null) {
            builder.location(eventAdminCreateDTO.getLocation());
        }
        if (eventAdminCreateDTO.getAttendeeCount() != 0) {
            builder.attendeeCount(eventAdminCreateDTO.getAttendeeCount());
        }
        if (eventAdminCreateDTO.getStatus() != null) {
            builder.status(eventAdminCreateDTO.getStatus());
        } else {
            builder.status(EventStatus.PENDING);
        }
        builder.likeCount(0);
        Event event = builder.build();
        // Generate slug from title
        event.setSlug(SlugUtils.generateSlug(event.getTitle()));
        eventRepository.save(event);
        return mapToEventSearchDTO(event, account);
    }

    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO updateEventStatus(Long eventId, EventStatusUpdateDTO eventStatusUpdateDTO) {
        Event event = findEvent(eventId);
        if (eventStatusUpdateDTO.getStatus() != null) {
            event.setStatus(eventStatusUpdateDTO.getStatus());
        } else {
            event.setStatus(EventStatus.PENDING);
        }
        eventRepository.save(event);
        return mapToEventSearchDTO(event, event.getCreatedBy());
    }

    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO updateEventDetails(Long eventId, EventUpdateDTO eventUpdateDTO) {
        if (eventUpdateDTO.getStartAt() != null && eventUpdateDTO.getEndAt() != null) {
            if (eventUpdateDTO.getStartAt().isAfter(eventUpdateDTO.getEndAt())) {
                throw new IllegalArgumentException("Start and end time must be greater than or equal to end time.");
            }
        }
        if (eventUpdateDTO.getAttendeeCount() < 0) {
            throw new IllegalArgumentException("Attendee count must be greater than or equal to 0.");
        }
        Event event = findEvent(eventId);
        if (eventUpdateDTO.getDescription() != null) {
            event.setDescription(eventUpdateDTO.getDescription());
        }
        if (eventUpdateDTO.getStartAt() != null) {
            event.setStartAt(eventUpdateDTO.getStartAt());
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
        if (eventUpdateDTO.getAttendeeCount() != null && eventUpdateDTO.getAttendeeCount() != 0) {
            event.setAttendeeCount(eventUpdateDTO.getAttendeeCount());
        }
        if (eventUpdateDTO.getTitle() != null) {
            event.setTitle(eventUpdateDTO.getTitle());
            // Update slug when title changes
            event.setSlug(SlugUtils.generateSlug(eventUpdateDTO.getTitle()));
        }
        eventRepository.save(event);
        return mapToEventSearchDTO(event, event.getCreatedBy());
    }




}
