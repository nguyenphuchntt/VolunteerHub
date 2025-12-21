package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Event.*;
import com.uet.VolunteerHub.dto.EventUser.EventUserRegisterDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.EventLikeService;
import com.uet.VolunteerHub.service.EventSearchService;
import com.uet.VolunteerHub.service.EventUserSearchService;
import com.uet.VolunteerHub.service.EventUserWriteService;
import com.uet.VolunteerHub.service.EventWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for event-related operations
 */
@RestController
@Log
@RequestMapping("/api/events")
public class EventController {
    private final EventSearchService eventSearchService;
    private final EventWriteService eventWriteService;
    private final EventUserWriteService eventUserWriteService;
    private final EventLikeService eventLikeService;
    private final EventUserSearchService eventUserSearchService;

    @Autowired
    public EventController(EventSearchService eventSearchService, EventWriteService eventWriteService,
            EventUserWriteService eventUserWriteService, EventLikeService eventLikeService,
            EventUserSearchService eventUserSearchService) {
        this.eventSearchService = eventSearchService;
        this.eventWriteService = eventWriteService;
        this.eventUserWriteService = eventUserWriteService;
        this.eventLikeService = eventLikeService;
        this.eventUserSearchService = eventUserSearchService;
    }

    /**
     * Search events with criteria (Admin only)
     * @param criteria search criteria
     * @param pageable pagination
     * @return page of events
     */
    @GetMapping("search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EventSearchDTO>> searchEvents(EventSearchCriteriaDTO criteria,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    /**
     * Search public events
     * @param criteria search criteria
     * @param pageable pagination
     * @return page of public events
     */
    @GetMapping("search-public")
    public ResponseEntity<Page<EventSearchDTO>> searchPublicEvents(EventSearchCriteriaDTO criteria,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findPublicEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    /**
     * Get event suggestions for autocomplete
     * @param query search query
     * @param limit max results (capped at 10)
     * @return list of suggestions
     */
    @GetMapping("suggestions")
    public ResponseEntity<List<EventSuggestionDTO>> getSuggestions(
            @RequestParam("q") String query,
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        List<EventSuggestionDTO> suggestions = eventSearchService.getSuggestions(query, Math.min(limit, 10));
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Get event details by ID
     * @param eventId event ID
     * @param account authenticated account (optional)
     * @return event details
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventSearchDTO> getEventByEventId(@PathVariable Long eventId,
            @AuthenticationPrincipal Account account) {
        Optional<EventSearchDTO> eventSearchDTOOptional = eventSearchService.findByEventID(eventId, account);
        return eventSearchDTOOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get approved participants of an event
     * @param eventId event ID
     * @param pageable pagination
     * @return page of participants
     */
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<Page<EventUserSearchDTO>> getEventParticipants(
            @PathVariable Long eventId,
            @PageableDefault(page = 0, size = 50) Pageable pageable) {
        // Get approved participants only (public access)
        Page<EventUserSearchDTO> participants = eventUserSearchService.findApprovedByEventId(eventId, pageable);
        return ResponseEntity.ok(participants);
    }

    /**
     * Get events created by an account
     * @param accountId account ID
     * @param account authenticated account
     * @param pageable pagination
     * @return page of events
     */
    @GetMapping("/accounts/{accountId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and #accountId == #account.accountId)")
    public ResponseEntity<Page<EventSearchDTO>> getEventsByAccountId(@PathVariable UUID accountId,
            @AuthenticationPrincipal Account account,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventsByAccountId(accountId, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    /**
     * Get events liked by an account
     * @param accountId account ID
     * @param pageable pagination
     * @return page of liked events
     */
    @GetMapping("/liked-by/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EventSearchDTO>> getEventsLikedByAccount(@PathVariable UUID accountId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventsLikedByAccount(accountId, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    /**
     * Get hot/trending events
     * @param category filter by category (optional)
     * @param pageable pagination
     * @return page of hot events
     */
    @GetMapping("/hot")
    public ResponseEntity<Page<EventSearchDTO>> getHotEvents(
            @RequestParam(required = false) String category,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findHotEvents(category, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    /**
     * Register a new event (Manager/Admin)
     * @param account authenticated account
     * @param eventManagerCreateDTO event data
     * @return created event
     */
    @PostMapping("/register-event")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EventSearchDTO> registerEvent(@AuthenticationPrincipal Account account,
            @RequestBody @Valid EventManagerCreateDTO eventManagerCreateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.registerEvent(account, eventManagerCreateDTO);
        EventUserRegisterDTO eventUserRegisterDTO = new EventUserRegisterDTO(
                eventSearchDTO.getStartAt(), eventSearchDTO.getEndAt());
        eventUserWriteService.registerEventUser(account, eventSearchDTO.getEventId(), eventUserRegisterDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    /**
     * Create a new event (Admin only)
     * @param account authenticated account
     * @param eventAdminCreateDTO event data
     * @return created event
     */
    @PostMapping("/create-event")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventSearchDTO> createEvent(@AuthenticationPrincipal Account account,
            @RequestBody @Valid EventAdminCreateDTO eventAdminCreateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.createEvent(account, eventAdminCreateDTO);
        EventUserRegisterDTO eventUserRegisterDTO = new EventUserRegisterDTO(
                eventSearchDTO.getStartAt(), eventSearchDTO.getEndAt());
        eventUserWriteService.registerEventUser(account, eventSearchDTO.getEventId(), eventUserRegisterDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    /**
     * Update event status (Admin only)
     * @param eventId event ID
     * @param eventStatusUpdateDTO new status
     * @param admin authenticated admin
     * @return updated event
     */
    @PatchMapping("/{eventId}/event-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventSearchDTO> updateEventStatus(@PathVariable Long eventId,
            @RequestBody @Valid EventStatusUpdateDTO eventStatusUpdateDTO,
            @AuthenticationPrincipal Account admin) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEventStatus(eventId, eventStatusUpdateDTO, admin);
        return ResponseEntity.ok(eventSearchDTO);
    }

    /**
     * Delete an event
     * @param eventId event ID
     * @return void
     */
    @DeleteMapping("/{eventId}/delete")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and @eventSecurityService.isCreatorOfEvent(#eventId))")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventWriteService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update event details
     * @param eventId event ID
     * @param eventUpdateDTO updated data
     * @return updated event
     */
    @PatchMapping("/{eventId}/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') and @eventSecurityService.isCreatorOfEvent(#eventId)")
    public ResponseEntity<EventSearchDTO> updateEventDetails(@PathVariable Long eventId,
            @RequestBody @Valid EventUpdateDTO eventUpdateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEventDetails(eventId, eventUpdateDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    /**
     * Toggle like on an event
     * @param account authenticated account
     * @param eventId event ID
     * @return like status
     */
    @PostMapping("/{eventId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EventLikeDTO> likeEvent(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId) {
        Optional<EventLikeDTO> eventLikeDTO = eventLikeService.toggleLikeEvent(account, eventId);
        return eventLikeDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Check if user liked an event
     * @param account authenticated account
     * @param eventId event ID
     * @return true if liked
     */
    @PostMapping("/{eventId}/liked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isEventLikedByUser(@AuthenticationPrincipal Account account,
            @PathVariable Long eventId) {
        boolean isLiked = eventLikeService.isEventLikedByUser(account, eventId);
        return ResponseEntity.ok(isLiked);
    }

    /**
     * Get all events (Admin only)
     * @return list of all events
     */
    @GetMapping("/find-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventSearchDTO>> findAllEvents() {
        List<EventSearchDTO> eventSearchDTOPage = eventSearchService.findAllEvents();
        return ResponseEntity.ok(eventSearchDTOPage);
    }
}
