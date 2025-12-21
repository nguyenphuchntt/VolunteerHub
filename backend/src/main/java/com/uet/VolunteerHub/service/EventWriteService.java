package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Event.*;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.events.event.EventApprovedEvent;
import com.uet.VolunteerHub.events.event.EventCancelledEvent;
import com.uet.VolunteerHub.events.event.EventRejectedEvent;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.util.SlugUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventWriteService {
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PushNotificationService pushNotificationService;
    private final EventUserRepository eventUserRepository;

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

    /**
     * Registers a new event by manager with PENDING status awaiting admin approval.
     * Validates time constraints and generates URL slug from title.
     * 
     * @param account the manager creating the event
     * @param eventManagerCreateDTO event creation data
     * @return EventSearchDTO with created event details
     * @throws IllegalArgumentException if validation fails
     */
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

    /**
     * Creates a new event by admin with specified status (can bypass PENDING).
     * Admin has full control over event status and properties.
     * 
     * @param account the admin creating the event
     * @param eventAdminCreateDTO event creation data with status
     * @return EventSearchDTO with created event details
     * @throws IllegalArgumentException if validation fails
     */
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

    /**
     * Updates event status and publishes notifications to relevant users.
     * Sends push notifications for approval, rejection, or cancellation events.
     * 
     * @param eventId the event ID to update
     * @param eventStatusUpdateDTO status update data with optional reason
     * @param admin the admin performing the update
     * @return EventSearchDTO with updated event
     */
    @Caching(evict = {
            @CacheEvict(value = "events", allEntries = true),
            @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO updateEventStatus(Long eventId, EventStatusUpdateDTO eventStatusUpdateDTO, Account admin) {
        Event event = findEvent(eventId);
        EventStatus oldStatus = event.getStatus();
        EventStatus newStatus = eventStatusUpdateDTO.getStatus() != null
                ? eventStatusUpdateDTO.getStatus()
                : EventStatus.PENDING;

        event.setStatus(newStatus);
        eventRepository.save(event);
        if (oldStatus != newStatus) {
            publishStatusChangeNotification(event, oldStatus, newStatus, admin, eventStatusUpdateDTO.getReason());
        }

        return mapToEventSearchDTO(event, event.getCreatedBy());
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

    private void publishStatusChangeNotification(Event event, EventStatus oldStatus,
            EventStatus newStatus, Account admin, String reason) {
        if (oldStatus == EventStatus.PENDING && newStatus == EventStatus.SCHEDULED) {
            eventPublisher.publishEvent(new EventApprovedEvent(this, admin, event));
            // Push notification to event creator (manager)
            pushNotificationService.pushNotificationToUser(
                    event.getCreatedBy().getAccountId(),
                    "Sự kiện '" + event.getTitle() + "' của bạn đã được phê duyệt!");
        } else if (oldStatus == EventStatus.PENDING &&
                newStatus != EventStatus.SCHEDULED &&
                newStatus != EventStatus.STARTED &&
                newStatus != EventStatus.FINISHED) {
        } else if (newStatus == EventStatus.CANCELLED) {
            // Get all approved participants to notify them
            List<Account> participants = accountRepository.findApprovedParticipantsByEventId(event.getEventId());
            eventPublisher.publishEvent(new EventCancelledEvent(this, admin, event, participants, reason));
        }
    }

    /**
     * Rejects a pending event and notifies the creator with reason.
     * Only PENDING events can be rejected, status changes to CANCELLED.
     * 
     * @param eventId the event ID to reject
     * @param admin the admin rejecting the event
     * @param reason the rejection reason message
     * @return EventSearchDTO with updated event
     * @throws IllegalArgumentException if event is not PENDING
     */
    @Caching(evict = {
            @CacheEvict(value = "events", allEntries = true),
            @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    @Transactional
    public EventSearchDTO rejectEvent(Long eventId, Account admin, String reason) {
        Event event = findEvent(eventId);
        if (event.getStatus() != EventStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING events can be rejected");
        }
        event.setStatus(EventStatus.CANCELLED);
        eventRepository.save(event);

        eventPublisher.publishEvent(new EventRejectedEvent(this, admin, event, reason));

        // Push notification to event creator (manager) about rejection
        String notificationContent = "Sự kiện '" + event.getTitle() + "' của bạn đã bị từ chối.";
        if (reason != null && !reason.isBlank()) {
            notificationContent += " Lý do: " + reason;
        }
        pushNotificationService.pushNotificationToUser(
                event.getCreatedBy().getAccountId(),
                notificationContent);

        return mapToEventSearchDTO(event, event.getCreatedBy());
    }

    /**
     * Updates event details such as title, description, time, location, and capacity.
     * Prevents reducing capacity below current approved participants count.
     * 
     * @param eventId the event ID to update
     * @param eventUpdateDTO event update data
     * @return EventSearchDTO with updated event
     * @throws IllegalArgumentException if validation fails or event is CANCELLED/FINISHED
     */
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
        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.FINISHED) {
            throw new IllegalArgumentException("Cannot update details of a CANCELLED or FINISHED event.");
        }

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
            long approvedCount = eventUserRepository.countByEventIdAndStatus(eventId,
                    com.uet.VolunteerHub.enums.EventUserStatus.APPROVED);
            if (eventUpdateDTO.getAttendeeCount() < approvedCount) {
                throw new IllegalArgumentException(
                        "Cannot reduce attendee count below the number of currently approved participants ("
                                + approvedCount + ")");
            }
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
