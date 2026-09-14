package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.AdminDashboard.ChartDataDTO;
import com.uet.VolunteerHub.dto.AdminDashboard.DashboardOverviewDTO;
import com.uet.VolunteerHub.dto.AdminDashboard.RankingItemDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.EventStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final AccountRepository accountRepository;
    private final EventRepository eventRepository;
    private final EventUserRepository eventUserRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final EventLikeRepository eventLikeRepository;
    private final PostRepository postRepository;
    private final PushNotificationService pushNotificationService;

    /**
     * Retrieves comprehensive dashboard statistics including users, events, and engagement.
     * Results are cached to improve performance for frequent dashboard access.
     * 
     * @return DashboardOverviewDTO with complete statistics
     */
    @Cacheable(value = "adminDashboard", key = "'overview'")
    public DashboardOverviewDTO getDashboardOverview() {
        // Users Stats
        long totalUsers = accountRepository.count();
        long newUsers = accountRepository.countByCreateAtBetween(
                Instant.now().minus(30, ChronoUnit.DAYS), Instant.now());
        long activeUsers = accountRepository.countByAccountStatus(AccountStatus.ACTIVE);
        long bannedUsers = accountRepository.countByAccountStatus(AccountStatus.BANNED);
        long inactiveUsers = accountRepository.countByAccountStatus(AccountStatus.INACTIVE);

        Map<String, Long> userByRole = new HashMap<>();
        userByRole.put("ADMIN", accountRepository.countByRole(UserRole.ADMIN));
        userByRole.put("MANAGER", accountRepository.countByRole(UserRole.MANAGER));
        userByRole.put("USER", accountRepository.countByRole(UserRole.USER));

        DashboardOverviewDTO.UserStats userStats = DashboardOverviewDTO.UserStats.builder()
                .summary(DashboardOverviewDTO.UserSummary.builder()
                        .total(totalUsers)
                        .newThisMonth(newUsers)
                        .active(activeUsers)
                        .banned(bannedUsers)
                        .inactive(inactiveUsers)
                        .build())
                .byRole(userByRole)
                .build();

        // Events Stats
        long totalEvents = eventRepository.count();
        long pendingEvents = eventRepository.countByStatus(EventStatus.DRAFT);
        long ongoingEvents = eventRepository.countByStatus(EventStatus.ONGOING);
        long finishedEvents = eventRepository.countByStatus(EventStatus.COMPLETED);
        long cancelledEvents = eventRepository.countByStatus(EventStatus.CANCELLED);
        long scheduledEvents = eventRepository.countByStatus(EventStatus.PUBLISHED);

        Long totalAttendeesLong = eventRepository.sumAttendeeCount();
        long totalAttendees = totalAttendeesLong != null ? totalAttendeesLong : 0;
        double completionRate = totalEvents > 0 ? (double) finishedEvents / totalEvents * 100 : 0;

        Map<String, Long> eventByCategory = new HashMap<>();
        List<Object[]> categoryCounts = eventRepository.countEventsByCategory();
        for (Object[] row : categoryCounts) {
            String category = (String) row[0];
            Long count = (Long) row[1];
            if (category != null) {
                eventByCategory.put(category, count);
            }
        }

        DashboardOverviewDTO.EventStats eventStats = DashboardOverviewDTO.EventStats.builder()
                .summary(DashboardOverviewDTO.EventSummary.builder()
                        .total(totalEvents)
                        .pending(pendingEvents)
                        .ongoing(ongoingEvents + scheduledEvents) // Active = Started + Scheduled
                        .finished(finishedEvents)
                        .cancelled(cancelledEvents)
                        .build())
                .performance(DashboardOverviewDTO.Performance.builder()
                        .totalAttendees(totalAttendees)
                        .completionRate(completionRate)
                        .avgAttendeesPerEvent(totalEvents > 0 ? (double) totalAttendees / totalEvents : 0)
                        .build())
                .byCategory(eventByCategory)
                .build();

        // Engagement Stats
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long totalLikes = postLikeRepository.count() + eventLikeRepository.count();

        DashboardOverviewDTO.EngagementStats engagementStats = DashboardOverviewDTO.EngagementStats.builder()
                .totalPosts(totalPosts)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .build();

        return DashboardOverviewDTO.builder()
                .users(userStats)
                .events(eventStats)
                .engagement(engagementStats)
                .build();
    }

    /**
     * Generates time-series chart data for the last 7 days.
     * Supports new_events_last_7_days and new_users_last_7_days chart types.
     * 
     * @param type the chart type to generate
     * @return ChartDataDTO with daily data points
     */
    @Cacheable(value = "adminDashboard", key = "'chart:' + #type")
    public ChartDataDTO getDashboardChart(String type) {
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Object[]> data = new ArrayList<>();

        if ("new_events_last_7_days".equals(type)) {
            data = eventRepository.countNewEventsByDate(sevenDaysAgo);
        } else if ("new_users_last_7_days".equals(type)) {
            data = accountRepository.countNewUsersByDate(sevenDaysAgo);
        }

        Map<String, Long> dataMap = new HashMap<>();
        for (Object[] row : data) {
            dataMap.put(row[0].toString(), (Long) row[1]);
        }

        List<ChartDataDTO.DataPoint> points = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            String date = java.time.LocalDate.now().minusDays(i).toString();
            points.add(ChartDataDTO.DataPoint.builder()
                    .date(date)
                    .count(dataMap.getOrDefault(date, 0L))
                    .build());
        }

        return ChartDataDTO.builder()
                .chartType(type)
                .data(points)
                .build();
    }

    /**
     * Retrieves top rankings based on type: top_events, top_active_users, or top_interactive_users.
     * Returns top 5 items ordered by relevant metrics (likes, participation, interaction score).
     * 
     * @param type the ranking type to retrieve
     * @return list of RankingItemDTO with top performers
     */
    @Cacheable(value = "adminDashboard", key = "'rankings:' + #type")
    public List<RankingItemDTO> getDashboardRankings(String type) {
        List<RankingItemDTO> rankings = new ArrayList<>();

        if ("top_events".equals(type)) {
            List<Event> topEvents = eventRepository.findTop5ByOrderByLikeCountDesc();
            for (Event event : topEvents) {
                rankings.add(RankingItemDTO.builder()
                        .id(event.getEventId())
                        .title(event.getTitle())
                        .subText("Attendees: " + event.getAttendeeCount())
                        .value(event.getLikeCount())
                        .status(event.getStatus().toString())
                        .build());
            }
        } else if ("top_active_users".equals(type)) {
            List<Object[]> topUsers = eventUserRepository.findTopActiveUsers(PageRequest.of(0, 5));
            for (Object[] row : topUsers) {
                Account account = (Account) row[0];
                Long count = (Long) row[1];
                rankings.add(RankingItemDTO.builder()
                        .id(account.getAccountId())
                        .title(account.getUsername())
                        .subText(account.getEmail())
                        .value(count)
                        .imageUrl(null)
                        .build());
            }
        } else if ("top_interactive_users".equals(type)) {
            List<Object[]> topUsers = accountRepository.findTopInteractiveUsers();
            for (Object[] row : topUsers) {
                String accountId = (String) row[0];
                String username = (String) row[1];
                String email = (String) row[2];
                Number score = (Number) row[3];

                rankings.add(RankingItemDTO.builder()
                        .id(accountId)
                        .title(username)
                        .subText(email)
                        .value(score.longValue())
                        .imageUrl(null)
                        .build());
            }
        }

        return rankings;
    }

    /**
     * Retrieves all events with PENDING status awaiting admin approval.
     * 
     * @return list of EventSearchDTO for pending events
     */
    @Transactional(readOnly = true)
    public List<com.uet.VolunteerHub.dto.Event.EventSearchDTO> getPendingEvents() {
        List<Event> events = eventRepository.findAllByStatus(EventStatus.DRAFT);
        return events.stream().map(event -> com.uet.VolunteerHub.dto.Event.EventSearchDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .createAt(event.getCreatedAt())
                .startAt(event.getStartAt())
                .endAt(event.getEndAt())
                .category(event.getCategory())
                .location(event.getLocation())
                .description(event.getDescription())
                .status(event.getStatus())
                .attendeeCount(event.getAttendeeCount())
                .likeCount(event.getLikeCount())
                .accountId(event.getCreatedBy() != null ? event.getCreatedBy().getAccountId() : null)
                .build())
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Updates event status and sends push notification to event creator.
     * Clears related caches and notifies manager of approval or cancellation.
     * 
     * @param eventId the event ID to update
     * @param status the new status (SCHEDULED, CANCELLED, etc.)
     * @throws IllegalArgumentException if status is invalid
     * @throws RuntimeException if event not found
     */
    @Caching(evict = {
            @CacheEvict(value = "adminDashboard", allEntries = true),
            @CacheEvict(value = "events", allEntries = true)
    })
    @Transactional
    public void updateEventStatus(Long eventId, String status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        try {
            EventStatus oldStatus = event.getStatus();
            EventStatus newStatus = EventStatus.valueOf(status.toUpperCase());
            event.setStatus(newStatus);
            eventRepository.save(event);

            // Send push notification to event creator (manager)
            if (event.getCreatedBy() != null && oldStatus != newStatus) {
                if (newStatus == EventStatus.PUBLISHED && oldStatus == EventStatus.DRAFT) {
                    pushNotificationService.pushNotificationToUser(
                            event.getCreatedBy().getAccountId(),
                            "Sự kiện '" + event.getTitle() + "' của bạn đã được phê duyệt!");
                } else if (newStatus == EventStatus.CANCELLED) {
                    pushNotificationService.pushNotificationToUser(
                            event.getCreatedBy().getAccountId(),
                            "Sự kiện '" + event.getTitle() + "' của bạn đã bị hủy.");
                }
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
