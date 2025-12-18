package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Request.RequestCreateDTO;
import com.uet.VolunteerHub.dto.Request.RequestReadDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@PreAuthorize("hasRole('USER')")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<RequestReadDTO> createRequest(
            @AuthenticationPrincipal Account account,
            @Valid @RequestBody RequestCreateDTO requestCreateDTO) {
        RequestReadDTO requestReadDTO = requestService.createRequest(account, requestCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(requestReadDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<Page<RequestReadDTO>> getMyRequests(
            @AuthenticationPrincipal Account account,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<RequestReadDTO> requests = requestService.getMyRequests(account, pageable);
        return ResponseEntity.ok(requests);
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Account account) {
        requestService.cancelRequest(requestId, account);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<RequestReadDTO> getRequestById(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Account account) {
        RequestReadDTO requestReadDTO = requestService.getRequestById(requestId, account);
        return ResponseEntity.ok(requestReadDTO);
    }
}
