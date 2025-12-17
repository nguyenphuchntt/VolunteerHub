package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
