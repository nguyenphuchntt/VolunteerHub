package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.EventUserCreateDTO;
import com.uet.VolunteerHub.dto.EventUserSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.EventUserSearchDTO;
import com.uet.VolunteerHub.dto.EventUserUpdateDTO;
import com.uet.VolunteerHub.service.EventUserSearchService;
import com.uet.VolunteerHub.service.EventUserWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@Log
@RestController
@RequestMapping("/api/event-users")
public class EventUserController {

    private final EventUserSearchService eventUserSearchService;
    private final EventUserWriteService eventUserWriteService;

    @Autowired
    public EventUserController(EventUserSearchService eventUserSearchService, 
                               EventUserWriteService eventUserWriteService) {
        this.eventUserSearchService = eventUserSearchService;
        this.eventUserWriteService = eventUserWriteService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EventUserSearchDTO>> searchEventUsers(
            EventUserSearchCriteriaDTO criteria, 
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventUserSearchDTO> eventUserPage = eventUserSearchService.findEventUsersBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventUserPage);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<Page<EventUserSearchDTO>> getEventUsersByAccountId(
            @PathVariable UUID accountId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventUserSearchDTO> eventUserPage = eventUserSearchService.findByAccountId(accountId, pageable);
        return ResponseEntity.ok(eventUserPage);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Page<EventUserSearchDTO>> getEventUsersByEventId(
            @PathVariable Long eventId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventUserSearchDTO> eventUserPage = eventUserSearchService.findByEventId(eventId, pageable);
        return ResponseEntity.ok(eventUserPage);
    }

    @GetMapping("/{accountId}/{eventId}")
    public ResponseEntity<EventUserSearchDTO> getEventUserById(
            @PathVariable UUID accountId, 
            @PathVariable Long eventId) {
        Optional<EventUserSearchDTO> eventUserOptional = eventUserSearchService.findByAccountIdAndEventId(accountId, eventId);
        return eventUserOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventUserSearchDTO> createEventUser(@RequestBody @Valid EventUserCreateDTO createDTO) {
        EventUserSearchDTO eventUserSearchDTO = eventUserWriteService.createEventUser(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventUserSearchDTO);
    }

    @PatchMapping("/{accountId}/{eventId}")
    public ResponseEntity<EventUserSearchDTO> updateEventUser(
            @PathVariable UUID accountId, 
            @PathVariable Long eventId, 
            @RequestBody @Valid EventUserUpdateDTO updateDTO) {
        EventUserSearchDTO eventUserSearchDTO = eventUserWriteService.updateEventUser(accountId, eventId, updateDTO);
        return ResponseEntity.ok(eventUserSearchDTO);
    }

    @DeleteMapping("/{accountId}/{eventId}")
    public ResponseEntity<Void> deleteEventUser(
            @PathVariable UUID accountId, 
            @PathVariable Long eventId) {
        eventUserWriteService.deleteEventUser(accountId, eventId);
        return ResponseEntity.noContent().build();
    }
}

