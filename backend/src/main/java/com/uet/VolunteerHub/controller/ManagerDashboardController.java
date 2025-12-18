package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.ManagerDashboard.*;
import com.uet.VolunteerHub.service.ManagerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager/events/{eventId}/dashboard")
@RequiredArgsConstructor
public class ManagerDashboardController {

    private final ManagerDashboardService managerDashboardService;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<EventStatsDTO> getEventOverview(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getEventStats(eventId));
    }

    @GetMapping("/participants-by-status")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<ParticipantsByStatusDTO>> getParticipantsByStatus(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getParticipantsByStatus(eventId));
    }

    @GetMapping("/participants-by-role")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<ParticipantsByRoleDTO>> getParticipantsByRole(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getParticipantsByRole(eventId));
    }

    @GetMapping("/attendance-rate")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<Map<String, Object>> getAttendanceRate(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getAttendanceRate(eventId));
    }

    @GetMapping("/registration-timeline")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<RegistrationTimelineDTO>> getRegistrationTimeline(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getRegistrationTimeline(eventId));
    }
}
