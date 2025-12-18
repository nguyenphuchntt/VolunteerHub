package com.uet.VolunteerHub.dto.ManagerDashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventStatsDTO {
    private Long eventId;
    private String eventTitle;
    private Integer totalParticipants;
    private Integer approvedParticipants;
    private Integer pendingParticipants;
    private Integer rejectedParticipants;
    private Integer finishedParticipants;
    private Integer unfinishedParticipants;
    private Integer totalManagers;
    private Integer totalAttendees;
    private Double attendanceRate; // Percentage of FINISHED vs total APPROVED
}
