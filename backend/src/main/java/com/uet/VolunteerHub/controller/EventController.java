package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Event.*;
import com.uet.VolunteerHub.dto.EventUser.EventUserRegisterDTO;
import com.uet.VolunteerHub.dto.EventUser.EventUserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
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

    @Autowired
    public EventController(EventSearchService eventSearchService, EventWriteService eventWriteService,
                           EventUserWriteService eventUserWriteService) {
        this.eventSearchService = eventSearchService;
        this.eventWriteService = eventWriteService;
        this.eventUserWriteService = eventUserWriteService;
    }

    @GetMapping("search")
    public ResponseEntity<Page<EventSearchDTO>> searchEvents(EventSearchCriteriaDTO criteria,
                                                             @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventSearchDTO> getEventByEventId(@PathVariable Long eventId) {
        Optional<EventSearchDTO> eventSearchDTOOptional = eventSearchService.findByEventID(eventId);
        return eventSearchDTOOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<Page<EventSearchDTO>> getEventsByAccountId(@PathVariable UUID accountId,
                                                                     @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventsByAccountId(accountId, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @PostMapping("/register-event")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EventSearchDTO> registerEvent(@AuthenticationPrincipal Account account,
                                                        @RequestBody @Valid EventManagerCreateDTO eventManagerCreateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.registerEvent(account, eventManagerCreateDTO);
        EventUserRegisterDTO eventUserRegisterDTO = new EventUserRegisterDTO(eventSearchDTO.getEventId(),
                eventSearchDTO.getStartAt(), eventSearchDTO.getEndAt());
        eventUserWriteService.registerEventUser(account,eventSearchDTO.getEventId(), eventUserRegisterDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

    @PostMapping("/create-event")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventSearchDTO> createEvent(@AuthenticationPrincipal Account account,
                                                      @RequestBody @Valid EventAdminCreateDTO eventAdminCreateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.createEvent(account, eventAdminCreateDTO);
        EventUserRegisterDTO eventUserRegisterDTO = new EventUserRegisterDTO(eventSearchDTO.getEventId(),
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
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and @eventSecurityService.isManagerOfEvent(#eventId))")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventWriteService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{eventId}/update")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('MANAGER') and @eventSecurityService.isManagerOfEvent(#eventId))")
    public ResponseEntity<EventSearchDTO> updateEventDetails(@PathVariable Long eventId,
                                                             @RequestBody @Valid EventUpdateDTO eventUpdateDTO) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEventDetails(eventId, eventUpdateDTO);
        return ResponseEntity.ok(eventSearchDTO);
    }

}
