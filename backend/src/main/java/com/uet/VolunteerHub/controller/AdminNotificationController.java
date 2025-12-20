package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.notification.AdminRequestNotificationDTO;
import com.uet.VolunteerHub.service.RoleBasedNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminNotificationController {

    private final RoleBasedNotificationService roleBasedNotificationService;

    @GetMapping("/pending-requests")
    public ResponseEntity<Page<AdminRequestNotificationDTO>> getPendingRequests(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminRequestNotificationDTO> requests = 
                roleBasedNotificationService.getAdminPendingRoleRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getPendingCounts() {
        long pendingRequests = roleBasedNotificationService.countAdminPendingRequests();
        return ResponseEntity.ok(Map.of(
                "pendingRoleRequests", pendingRequests,
                "total", pendingRequests
        ));
    }
}
