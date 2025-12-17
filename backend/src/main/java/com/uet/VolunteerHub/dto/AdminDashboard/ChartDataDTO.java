package com.uet.VolunteerHub.dto.AdminDashboard;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ChartDataDTO {
    private String chartType;
    private List<DataPoint> data;

    @Data
    @Builder
    public static class DataPoint {
        private String date;
        private long count;
    }
}
