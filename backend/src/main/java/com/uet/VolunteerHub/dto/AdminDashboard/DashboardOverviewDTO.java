package com.uet.VolunteerHub.dto.AdminDashboard;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardOverviewDTO {
    private UserStats users;
    private EventStats events;
    private EngagementStats engagement;

    @Data
    @Builder
    public static class UserStats {
        private UserSummary summary;
        private Map<String, Long> byRole;
    }

    @Data
    @Builder
    public static class EventStats {
        private EventSummary summary;
        private Performance performance;
        private Map<String, Long> byCategory;
    }

    @Data
    @Builder
    public static class EngagementStats {
        private long totalPosts;
        private long totalLikes;
        private long totalComments;
    }

    @Data
    @Builder
    public static class UserSummary {
        private long total;
        private long newThisMonth;
        private long active;
        private long banned;
        private long inactive;
    }

    @Data
    @Builder
    public static class EventSummary {
        private long total;
        private long pending;
        private long ongoing;
        private long finished;
        private long cancelled;
    }

    @Data
    @Builder
    public static class Performance {
        private long totalAttendees;
        private double completionRate;
        private double avgAttendeesPerEvent;
    }
}
