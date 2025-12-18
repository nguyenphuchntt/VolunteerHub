package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.service.EventUserSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/manager/pending-users")
@RequiredArgsConstructor
public class ManagerPendingUsersController {

    private final EventUserSearchService eventUserSearchService;
    private final EventUserRepository eventUserRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<EventUserSearchDTO>> getAllPendingUsers(
            @AuthenticationPrincipal Account account,
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        boolean isEventManager = eventUserRepository.isEventManager(account.getAccountId());
        if (!isEventManager) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not event manager of any event."
            );
        }
        return ResponseEntity.ok(
            eventUserSearchService.findPendingUsersByManagerId(account.getAccountId(), pageable)
        );
    }

    @GetMapping("/is-event-manager")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> checkIfEventManager(
            @AuthenticationPrincipal Account account) {
        boolean isEventManager = eventUserRepository.isEventManager(account.getAccountId());
        return ResponseEntity.ok(Map.of("isEventManager", isEventManager));
    }
}
