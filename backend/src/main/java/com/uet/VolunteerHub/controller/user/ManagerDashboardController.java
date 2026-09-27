package com.uet.VolunteerHub.controller.user;

import com.uet.VolunteerHub.dto.ManagerDashboard.*;
import com.uet.VolunteerHub.service.ManagerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for event manager dashboard operations
 */
@RestController
@RequestMapping("/api/manager/events/{eventId}/dashboard")
@RequiredArgsConstructor
public class ManagerDashboardController {

    private final ManagerDashboardService managerDashboardService;

    /**
     * Get event overview statistics
     * @param eventId event ID
     * @return event statistics
     */
    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<EventStatsDTO> getEventOverview(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getEventStats(eventId));
    }

    /**
     * Get participants grouped by status
     * @param eventId event ID
     * @return participants by status
     */
    @GetMapping("/participants-by-status")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<ParticipantsByStatusDTO>> getParticipantsByStatus(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getParticipantsByStatus(eventId));
    }

    /**
     * Get participants grouped by role
     * @param eventId event ID
     * @return participants by role
     */
    @GetMapping("/participants-by-role")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<ParticipantsByRoleDTO>> getParticipantsByRole(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getParticipantsByRole(eventId));
    }

    /**
     * Get attendance rate statistics
     * @param eventId event ID
     * @return attendance rate data
     */
    @GetMapping("/attendance-rate")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<Map<String, Object>> getAttendanceRate(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getAttendanceRate(eventId));
    }

    /**
     * Get registration timeline data
     * @param eventId event ID
     * @return registration timeline
     */
    @GetMapping("/registration-timeline")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<List<RegistrationTimelineDTO>> getRegistrationTimeline(@PathVariable Long eventId) {
        return ResponseEntity.ok(managerDashboardService.getRegistrationTimeline(eventId));
    }
}
