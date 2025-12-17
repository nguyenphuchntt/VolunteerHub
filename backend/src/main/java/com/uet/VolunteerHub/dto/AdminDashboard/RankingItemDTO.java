package com.uet.VolunteerHub.dto.AdminDashboard;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class RankingItemDTO {
    // Common fields
    private Object id; // Can be Long or UUID
    private String title; // Event title or Username/Fullname
    private String subText; // Additional info
    private String imageUrl; // Avatar or Event thumbnail

    // Metrics
    private long value;
    private Map<String, Object> details;
    private String status; // For events
}
