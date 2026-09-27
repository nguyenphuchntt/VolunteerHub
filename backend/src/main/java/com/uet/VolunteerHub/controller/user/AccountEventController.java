package com.uet.VolunteerHub.controller.user;

import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserRegisterDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserUpdateDTO;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.service.EventSearchService;
import com.uet.VolunteerHub.service.EventUserSearchService;
import com.uet.VolunteerHub.service.EventUserWriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authenticated user's event operations
 */
@RestController
@RequestMapping("/api/me/events")
@PreAuthorize("isAuthenticated()")
public class AccountEventController {

    private final EventUserSearchService eventUserSearchService;
    private final EventUserWriteService eventUserWriteService;
    private final EventSearchService eventSearchService;

    @Autowired
    public AccountEventController(EventUserSearchService eventUserSearchService,
            EventUserWriteService eventUserWriteService,
            EventSearchService eventSearchService) {
        this.eventUserSearchService = eventUserSearchService;
        this.eventUserWriteService = eventUserWriteService;
        this.eventSearchService = eventSearchService;
    }

    /**
     * Get all events user is participating in
     * @param account authenticated account
     * @param status filter by status (optional)
     * @param pageable pagination
     * @return page of user events
     */
    @GetMapping
    public ResponseEntity<Page<EventUserSearchDTO>> getAllEvents(@AuthenticationPrincipal Account account,
            @RequestParam(required = false) EventUserStatus status,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        Page<EventUserSearchDTO> eventUserSearchDTOPage = eventUserSearchService.findByAccountId(account.getAccountId(),
                status, pageable);
        return ResponseEntity.ok(eventUserSearchDTOPage);
    }

    /**
     * Get events liked by user
     * @param account authenticated account
     * @param pageable pagination
     * @return page of liked events
     */
    @GetMapping("/liked")
    public ResponseEntity<Page<EventSearchDTO>> getLikedEvents(@AuthenticationPrincipal Account account,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return ResponseEntity.ok(eventSearchService.findEventsLikedByAccount(account.getAccountId(), pageable));
    }

    /**
     * Get user's participation details for specific event
     * @param account authenticated account
     * @param eventId event ID
     * @return event participation details
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventUserSearchDTO> getEvent(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(eventUserSearchService.findByAccountIdAndEventId(account.getAccountId(), eventId));
    }

    /**
     * Register for an event
     * @param account authenticated account
     * @param eventId event ID
     * @param eventUserRegisterDTO registration data
     * @return registration details
     */
    @PostMapping("/{eventId}/register")
    public ResponseEntity<EventUserSearchDTO> registerForEvent(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId, @RequestBody @Valid EventUserRegisterDTO eventUserRegisterDTO) {
        return ResponseEntity.ok(eventUserWriteService.registerEventUser(account, eventId, eventUserRegisterDTO));
    }

    /**
     * Unregister from an event
     * @param account authenticated account
     * @param eventId event ID
     * @return void
     */
    @DeleteMapping("/{eventId}/unregister")
    public ResponseEntity<Void> unregisterForEvent(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId) {
        eventUserWriteService.deleteEventUser(account, eventId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update event participation details
     * @param account authenticated account
     * @param eventId event ID
     * @param eventUserUpdateDTO update data
     * @return updated participation details
     */
    @PatchMapping("/{eventId}/update")
    public ResponseEntity<EventUserSearchDTO> updateEvent(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId, @RequestBody @Valid EventUserUpdateDTO eventUserUpdateDTO) {
        return ResponseEntity.ok(eventUserWriteService.updateEventUser(account, eventId, eventUserUpdateDTO));
    }

}
