package com.uet.VolunteerHub.controller.event;

import com.uet.VolunteerHub.dto.EventUser.*;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.EventUserSearchService;
import com.uet.VolunteerHub.service.EventUserWriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for event user (participant) management
 */
@RestController
@RequestMapping("/api/event-users")
public class EventUserController {
    private final EventUserWriteService eventUserWriteService;
    private final EventUserSearchService eventUserSearchService;

    @Autowired
    public EventUserController(EventUserWriteService eventUserWriteService,
            EventUserSearchService eventUserSearchService) {
        this.eventUserWriteService = eventUserWriteService;
        this.eventUserSearchService = eventUserSearchService;
    }

    /**
     * Search event users with criteria (Admin only)
     * @param criteria search criteria
     * @param pageable pagination
     * @return page of event users
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EventUserSearchDTO>> searchEventUsers(EventUserSearchCriteriaDTO criteria,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return ResponseEntity.ok(eventUserSearchService.findEventUsersBySpecification(criteria, pageable));
    }

    @GetMapping("/accounts/{accountId}")
    @PreAuthorize("authentication.principal.accountId.equals(#accountId) or hasRole('ADMIN')")
    public ResponseEntity<Page<EventUserSearchDTO>> searchEventUsersByAccountId(@PathVariable UUID accountId,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return ResponseEntity.ok(eventUserSearchService.findByAccountId(accountId, pageable));
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<Page<EventUserSearchDTO>> searchEventUsersByEventId(
            @PathVariable Long eventId,
            @RequestParam(required = false) EventUserRole role,
            @RequestParam(required = false) EventUserStatus status,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {

        if (role != null || status != null) {
            EventUserSearchCriteriaDTO criteria = EventUserSearchCriteriaDTO.builder()
                    .eventId(eventId)
                    .role(role)
                    .status(status)
                    .build();
            return ResponseEntity.ok(eventUserSearchService.findEventUsersBySpecification(criteria, pageable));
        }

        return ResponseEntity.ok(eventUserSearchService.findByEventId(eventId, pageable));
    }

    @GetMapping("/{eventId}/{accountId}")
    @PreAuthorize("@eventUserSecurityService.isManager(#eventId) or authentication.principal.accountId.equals(#accountId)")
    public ResponseEntity<EventUserSearchDTO> searchEventUsersByAccountIdAndEventId(@PathVariable UUID accountId,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(eventUserSearchService.findByAccountIdAndEventId(accountId, eventId));
    }

    @PostMapping("/{eventId}/{accountId}/create")
    @PreAuthorize("(hasRole('ADMIN')) or " +
            "(@eventUserSecurityService.isManager(#eventId))")
    public ResponseEntity<EventUserSearchDTO> createEventUser(@PathVariable UUID accountId,
            @PathVariable Long eventId,
            @RequestBody @Valid EventUserCreateDTO createDTO) {
        return ResponseEntity.ok(eventUserWriteService.createEventUser(accountId, eventId, createDTO));
    }

    @DeleteMapping("/{eventId}/{accountId}/delete")
    @PreAuthorize("(hasRole('ADMIN')) or " +
            "(@eventUserSecurityService.isManager(#eventId) and " +
            "(authentication.principal.accountId.equals(#accountId) or not @eventSecurityService.isCreatorOfEvent(#eventId, #accountId)))")
    public ResponseEntity<Void> deleteEventUser(@PathVariable Long eventId, @PathVariable UUID accountId) {
        eventUserWriteService.deleteEventUser(accountId, eventId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{eventId}/{accountId}/update-role")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<EventUserSearchDTO> updateEventUserRole(@PathVariable Long eventId,
            @PathVariable UUID accountId,
            @RequestBody @Valid EventUserRoleUpdateDTO updateDTO,
            @AuthenticationPrincipal Account caller) {
        return ResponseEntity.ok(eventUserWriteService.updateRole(accountId, eventId, updateDTO, caller));
    }

    @PatchMapping("/{eventId}/{accountId}/update-status")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(@eventUserSecurityService.isManager(#eventId)) and " +
            "(not authentication.principal.accountId.equals(#accountId)) and " +
            "(not @eventSecurityService.isCreatorOfEvent(#eventId, #accountId))")
    public ResponseEntity<EventUserSearchDTO> updateEventUserStatus(@PathVariable Long eventId,
            @PathVariable UUID accountId,
            @RequestBody @Valid EventUserStatusUpdateDTO updateDTO) {
        return ResponseEntity.ok(eventUserWriteService.updateStatus(accountId, eventId, updateDTO));
    }

    /**
     * Bulk approve event user registrations
     * @param eventId event ID
     * @param bulkOperationDTO account IDs to approve
     * @return operation result
     */
    @PostMapping("/{eventId}/bulk-approve")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<Map<String, Object>> bulkApprove(
            @PathVariable Long eventId,
            @RequestBody @Valid BulkOperationDTO bulkOperationDTO) {
        return ResponseEntity.ok(eventUserWriteService.bulkApprove(eventId, bulkOperationDTO.getAccountIds()));
    }

    /**
     * Bulk reject event user registrations
     * @param eventId event ID
     * @param bulkOperationDTO account IDs to reject
     * @return operation result
     */
    @PostMapping("/{eventId}/bulk-reject")
    @PreAuthorize("hasRole('ADMIN') or @eventUserSecurityService.isManager(#eventId)")
    public ResponseEntity<Map<String, Object>> bulkReject(
            @PathVariable Long eventId,
            @RequestBody @Valid BulkOperationDTO bulkOperationDTO) {
        return ResponseEntity.ok(eventUserWriteService.bulkReject(eventId, bulkOperationDTO.getAccountIds()));
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventUserSearchDTO>> getAllEventUsers() {
        return ResponseEntity.ok(eventUserSearchService.findAllEventUsers());
    }

    @GetMapping("/get-all-by-event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventUserSearchDTO>> getAllEventUsersByEventId(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventUserSearchService.findAllEventUsersByEventId(eventId));
    }

    @GetMapping("/get-all-by-account/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventUserSearchDTO>> getAllEventUsersByAccountId(@PathVariable UUID accountId) {
        return ResponseEntity.ok(eventUserSearchService.findAllEventUsersByAccountId(accountId));
    }
}
