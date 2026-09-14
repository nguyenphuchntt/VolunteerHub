package com.uet.VolunteerHub.scheduler;

import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.repository.EventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Scheduler to automatically update event statuses based on time.
 * - SCHEDULED -> STARTED when startAt time is reached
 * - STARTED -> FINISHED when endAt time is passed
 */
@Slf4j
@Component
public class EventStatusScheduler {

    private final EventRepository eventRepository;

    @Autowired
    public EventStatusScheduler(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Runs every 5 minutes to check and update event statuses.
     * - Updates SCHEDULED events to STARTED if startAt <= now
     * - Updates STARTED events to FINISHED if endAt < now
     */
    @Scheduled(fixedRate = 300000) // 5 minutes = 300,000 ms
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "events", allEntries = true),
        @CacheEvict(value = "adminDashboard", allEntries = true)
    })
    public void updateEventStatuses() {
        Instant now = Instant.now();
        
        // 1. Update SCHEDULED -> STARTED (event has started)
        List<Event> scheduledEvents = eventRepository.findAllByStatus(EventStatus.PUBLISHED);
        int startedCount = 0;
        for (Event event : scheduledEvents) {
            if (event.getStartAt() != null && event.getStartAt().isBefore(now)) {
                event.setStatus(EventStatus.ONGOING);
                eventRepository.save(event);
                startedCount++;
                log.info("Event '{}' (ID: {}) status changed from SCHEDULED to STARTED", 
                    event.getTitle(), event.getEventId());
            }
        }

        // 2. Update STARTED -> FINISHED (event has ended)
        List<Event> startedEvents = eventRepository.findAllByStatus(EventStatus.ONGOING);
        int finishedCount = 0;
        for (Event event : startedEvents) {
            if (event.getEndAt() != null && event.getEndAt().isBefore(now)) {
                event.setStatus(EventStatus.COMPLETED);
                eventRepository.save(event);
                finishedCount++;
                log.info("Event '{}' (ID: {}) status changed from STARTED to FINISHED", 
                    event.getTitle(), event.getEventId());
            }
        }

        if (startedCount > 0 || finishedCount > 0) {
            log.info("Event status update completed: {} events started, {} events finished", 
                startedCount, finishedCount);
        }
    }
}
