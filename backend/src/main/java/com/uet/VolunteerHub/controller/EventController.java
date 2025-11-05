package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Event.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.Event.EventSearchDTO;
import com.uet.VolunteerHub.service.EventSearchService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@Log
@RequestMapping("/api/events")
public class EventController {
    private final EventSearchService eventSearchService;

    @Autowired
    public EventController(EventSearchService eventSearchService) {
        this.eventSearchService = eventSearchService;
    }

    @GetMapping("search")
    public ResponseEntity<Page<EventSearchDTO>> searchEvents(EventSearchCriteriaDTO criteria,
                                                             @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventSearchDTO> getEventById(@PathVariable Long id) {
        Optional<EventSearchDTO> eventSearchDTOOptional = eventSearchService.findByEventID(id);
        return eventSearchDTOOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<Page<EventSearchDTO>> getEventByAccountId(@PathVariable UUID accountId,
                                                                    @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventsByAccountId(accountId, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

}
