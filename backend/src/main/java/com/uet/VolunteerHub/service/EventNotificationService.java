package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class EventNotificationService {
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;
    private final PushNotificationService pushNotificationService;

    @Autowired
    public EventNotificationService(EventRepository eventRepository,
                                    EventUserRepository eventUserRepository,
                                    PushNotificationService pushNotificationService) {
        this.eventRepository = eventRepository;
        this.eventUserRepository = eventUserRepository;
        this.pushNotificationService = pushNotificationService;
    }

    @Scheduled(cron= "0 0 8 * * *")
    @Transactional
    public void notifyUpcomingEvents() {
        ZoneId zone = ZoneId.systemDefault();

        ZonedDateTime startZone = ZonedDateTime.now(zone).plusDays(3)
                .withHour(3)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        Instant start = startZone.toInstant();
        ZonedDateTime endZone = startZone
                .withHour(23)
                .withMinute(59)
                .withSecond(59);

        Instant end = endZone.toInstant();

        List<Event> events = eventRepository.findScheduledEventsBetweenTimes(start, end);

        for (Event event : events) {
            Long eventId = event.getEventId();
            List<EventUser> participants = eventUserRepository.findApprovedEventUser(eventId);
            List<UUID> accountIds = participants.stream().map(
                    EventUser::getAccountId
            ).toList();
            pushNotificationService.pushNotificationToMultipleUsers(
                    accountIds,
                    "Sự kiện sắp diễn ra trong 3 ngày: " + event.getTitle()
            );
        }
    }


    @Scheduled(cron= "0 0 8 * * *")
    @Transactional
    public void notifyStartingEvents() {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);

        Instant start = today.atStartOfDay(zone).toInstant();
        Instant end = today.atTime(LocalTime.MAX).atZone(zone).toInstant();

        List<Event> events = eventRepository.findScheduledEventsBetweenTimes(start, end);

        for (Event event : events) {
            Long eventId = event.getEventId();
            List<EventUser> participants = eventUserRepository.findApprovedEventUser(eventId);
            List<UUID> accountIds = participants.stream().map(
                    EventUser::getAccountId
            ).toList();
            pushNotificationService.pushNotificationToMultipleUsers(
                    accountIds,
                    "Sự kiện bắt đầu ngày hôm nay: " + event.getTitle()
            );
        }
    }

}
