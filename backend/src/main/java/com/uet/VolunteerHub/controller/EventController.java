package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.EventSearchDTO;
import com.uet.VolunteerHub.dto.EventUpdateDTO;
import com.uet.VolunteerHub.service.EventSearchService;
import com.uet.VolunteerHub.service.EventWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Log
@RequestMapping("/api/events")
public class EventController {
    private final EventSearchService eventSearchService;
    private final EventWriteService eventWriteService;

    @Autowired
    public EventController(EventSearchService eventSearchService, EventWriteService eventWriteService) {
        this.eventSearchService = eventSearchService;
        this.eventWriteService = eventWriteService;
    }

    @GetMapping("search")
    public ResponseEntity<Page<EventSearchDTO>> searchEvents(EventSearchCriteriaDTO criteria, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<EventSearchDTO> eventSearchDTOPage = eventSearchService.findEventBySpecification(criteria, pageable);
        return ResponseEntity.ok(eventSearchDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventSearchDTO> getEventById(@PathVariable Long id) {
        Optional<EventSearchDTO> eventSearchDTOOptional = eventSearchService.findByEventID(id);
        return eventSearchDTOOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EventSearchDTO> updateEvent(@PathVariable Long id, @RequestBody @Valid EventUpdateDTO dto) {
        EventSearchDTO eventSearchDTO = eventWriteService.updateEvent(id, dto);
        return ResponseEntity.ok(eventSearchDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventWriteService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
