package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.NotificationCreateDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.NotificationType;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.NotificationRepository;
import com.uet.VolunteerHub.service.AdminDashboardService;
import com.uet.VolunteerHub.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * REST controller for admin dashboard operations
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;
    private final AccountRepository accountRepository;
    private final NotificationService notificationService;

    /**
     * Get dashboard overview statistics
     * @return overview stats
     */
    @GetMapping("/stats/overview")
    public ResponseEntity<?> getDashboardOverview() {
        return ResponseEntity.ok(adminDashboardService.getDashboardOverview());
    }

    /**
     * Get dashboard chart data
     * @param type chart type (default: new_events_last_7_days)
     * @return chart data
     */
    @GetMapping("/stats/charts")
    public ResponseEntity<?> getDashboardCharts(@RequestParam(value = "type", defaultValue = "new_events_last_7_days") String type) {
        return ResponseEntity.ok(adminDashboardService.getDashboardChart(type));
    }

    /**
     * Get dashboard rankings
     * @param type ranking type (default: top_events)
     * @return ranking data
     */
    @GetMapping("/stats/rankings")
    public ResponseEntity<?> getDashboardRankings(@RequestParam(value = "type", defaultValue = "top_events") String type) {
        return ResponseEntity.ok(adminDashboardService.getDashboardRankings(type));
    }

    /**
     * Get pending events awaiting approval
     * @return list of pending events
     */
    @GetMapping("/events/pending")
    public ResponseEntity<?> getPendingEvents() {
        return ResponseEntity.ok(adminDashboardService.getPendingEvents());
    }

    /**
     * Update event status
     * @param id event ID
     * @param statusUpdate status update data
     * @return success message
     */
    @PatchMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }
        try {
            adminDashboardService.updateEventStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Event status updated to " + status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    /**
     * Create system announcement notification
     * @param dto notification data
     * @param userDetails authenticated admin
     * @return void
     */
    @PostMapping("/notifications")
    public ResponseEntity<Void> createAnnouncementNotification(
            @RequestBody @Valid NotificationCreateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        Account sender = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin not found"));
        notificationService.createNotification(sender, sender, NotificationType.SYSTEM_ANNOUNCEMENT, dto.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
