package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;

    // Dashboard Overview
    @GetMapping("/stats/overview")
    public ResponseEntity<?> getDashboardOverview() {
        return ResponseEntity.ok(adminDashboardService.getDashboardOverview());
    }

    // Dashboard Charts
    @GetMapping("/stats/charts")
    public ResponseEntity<?> getDashboardCharts(@RequestParam(value = "type", defaultValue = "new_events_last_7_days") String type) {
        return ResponseEntity.ok(adminDashboardService.getDashboardChart(type));
    }

    // Dashboard Rankings
    @GetMapping("/stats/rankings")
    public ResponseEntity<?> getDashboardRankings(@RequestParam(value = "type", defaultValue = "top_events") String type) {
        return ResponseEntity.ok(adminDashboardService.getDashboardRankings(type));
    }

    @GetMapping("/events/pending")
    public ResponseEntity<?> getPendingEvents() {
        return ResponseEntity.ok(adminDashboardService.getPendingEvents());
    }

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
}
