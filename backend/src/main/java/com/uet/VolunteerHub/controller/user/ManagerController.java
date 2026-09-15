package com.uet.VolunteerHub.controller.user;

import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.repository.EventUserRepository;
import com.uet.VolunteerHub.service.EventSearchService;
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

/**
 * REST controller for event manager operations
 */
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final EventUserSearchService eventUserSearchService;
    private final EventUserRepository eventUserRepository;
    private final EventSearchService eventSearchService;

    /**
     * Get all pending user registrations for managed events
     * @param account authenticated manager
     * @param pageable pagination
     * @return page of pending users
     */
    @GetMapping("/pending-users")
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

    /**
     * Check if user is an event manager
     * @param account authenticated account
     * @return true if user manages any events
     */
    @GetMapping("/is-event-manager")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> checkIfEventManager(
            @AuthenticationPrincipal Account account) {
        boolean isEventManager = eventUserRepository.isEventManager(account.getAccountId());
        return ResponseEntity.ok(Map.of("isEventManager", isEventManager));
    }

    /**
     * Get events managed by current user
     * @param account authenticated manager
     * @param pageable pagination
     * @return page of managed events
     */
    @GetMapping("/me/managed-events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<EventSearchDTO>> getManagedEvents(
            @AuthenticationPrincipal Account account,
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        return ResponseEntity.ok(
            eventSearchService.findManagedEvents(account.getAccountId(), pageable)
        );
    }
}
