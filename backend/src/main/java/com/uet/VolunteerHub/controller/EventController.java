package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Event.*;
import com.uet.VolunteerHub.dto.EventUser.EventUserRegisterDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.EventLikeService;
import com.uet.VolunteerHub.service.EventSearchService;
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

import java.util.Optional;
import java.util.UUID;

@RestController
@Log
@RequestMapping("/api/events")
public class EventController {
    private final EventSearchService eventSearchService;
    private final EventWriteService eventWriteService;
    private final EventUserWriteService eventUserWriteService;
    private final EventLikeService eventLikeService;

    @Autowired
    public EventController(EventSearchService eventSearchService, EventWriteService eventWriteService,
                           EventUserWriteService eventUserWriteService, EventLikeService eventLikeService) {
        this.eventSearchService = eventSearchService;
        this.eventWriteService = eventWriteService;
        this.eventUserWriteService = eventUserWriteService;
        this.eventLikeService = eventLikeService;
    }

    @GetMapping("search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EventSearchDTO>> searchEvents(EventSearchCriteriaDTO criteria,
                                                             @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @GetMapping("search-public")
    public ResponseEntity<Page<EventSearchDTO>> searchPublicEvents(EventSearchCriteriaDTO criteria,
                                                                   @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findPublicEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventSearchDTO> getEventByEventId(@PathVariable Long eventId, @AuthenticationPrincipal Account account) {
        UUID accountId = (account != null) ? account.getAccountId() : null;
        Optional<EventSearchDTO> eventSearchDTOOptional = eventSearchService.findByEventID(eventId, accountId);
        return eventSearchDTOOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/accounts/{accountId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and #accountId == #account.accountId)")
    public ResponseEntity<Page<EventSearchDTO>> getEventsByAccountId(@PathVariable UUID accountId,
                                                                     @AuthenticationPrincipal Account account,
                                                                     @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventsByAccountId(accountId, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @PostMapping("/register-event")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EventSearchDTO> registerEvent(@AuthenticationPrincipal Account account,
                                                        @RequestBody @Valid EventManagerCreateDTO eventManagerCreateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.registerEvent(account, eventManagerCreateDTO);
        EventUserRegisterDTO eventUserRegisterDTO = new EventUserRegisterDTO(
                eventSearchDTO.getStartAt(), eventSearchDTO.getEndAt());
        eventUserWriteService.registerEventUser(account,eventSearchDTO.getEventId(), eventUserRegisterDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

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

    @PatchMapping("/{eventId}/event-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventSearchDTO> updateEventStatus(@PathVariable Long eventId,
                                                            @RequestBody @Valid EventStatusUpdateDTO eventStatusUpdateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEventStatus(eventId, eventStatusUpdateDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    @DeleteMapping("/{eventId}/delete")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and @eventSecurityService.isCreatorOfEvent(#eventId))")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventWriteService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{eventId}/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') and @eventSecurityService.isCreatorOfEvent(#eventId)")
    public ResponseEntity<EventSearchDTO> updateEventDetails(@PathVariable Long eventId,
                                                             @RequestBody @Valid EventUpdateDTO eventUpdateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEventDetails(eventId, eventUpdateDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    @PostMapping("/{eventId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EventLikeDTO> likeEvent(@AuthenticationPrincipal Account account, @PathVariable Long eventId) {
        Optional<EventLikeDTO> eventLikeDTO = eventLikeService.toggleLikeEvent(account, eventId);
        return eventLikeDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

}
