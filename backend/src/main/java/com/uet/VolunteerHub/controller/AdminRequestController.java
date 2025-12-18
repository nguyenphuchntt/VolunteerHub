package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Request.RequestReadDTO;
import com.uet.VolunteerHub.dto.Request.RequestReviewDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.RequestStatus;
import com.uet.VolunteerHub.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/requests")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    private final RequestService requestService;

    @Autowired
    public AdminRequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<Page<RequestReadDTO>> getAllRequests(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<RequestReadDTO> requests = requestService.getAllRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<RequestReadDTO>> getRequestsByStatus(
            @PathVariable RequestStatus status,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<RequestReadDTO> requests = requestService.getRequestsByStatus(status, pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending-count")
    public ResponseEntity<Map<String, Long>> getPendingRequestsCount() {
        long count = requestService.countPendingRequests();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{requestId}/review")
    public ResponseEntity<RequestReadDTO> reviewRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Account admin,
            @Valid @RequestBody RequestReviewDTO requestReviewDTO) {
        RequestReadDTO requestReadDTO = requestService.reviewRequest(requestId, admin, requestReviewDTO);
        return ResponseEntity.ok(requestReadDTO);
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<RequestReadDTO> getRequestById(@PathVariable Long requestId) {
        RequestReadDTO requestReadDTO = requestService.getRequestByIdForAdmin(requestId);
        return ResponseEntity.ok(requestReadDTO);
    }
}
