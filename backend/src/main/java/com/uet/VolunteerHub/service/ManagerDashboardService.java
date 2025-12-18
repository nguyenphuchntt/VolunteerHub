package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.ManagerDashboard.*;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class ManagerDashboardService {
    
    private final EventUserRepository eventUserRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public EventStatsDTO getEventStats(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);

        return EventStatsDTO.builder()
                .eventId(eventId)
                .eventTitle(event.getTitle())
                .totalParticipants(eventUsers.size())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ParticipantsByStatusDTO> getParticipantsByStatus(Long eventId) {
        // Verify event exists
        eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);
        Map<EventUserStatus, Long> statusCounts = eventUsers.stream()
                .collect(Collectors.groupingBy(EventUser::getStatus, Collectors.counting()));
        return statusCounts.entrySet().stream()
                .map(entry -> ParticipantsByStatusDTO.builder()
                        .status(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ParticipantsByRoleDTO> getParticipantsByRole(Long eventId) {
        // Verify event exists
        eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);
        Map<EventUserRole, Long> roleCounts = eventUsers.stream()
                .collect(Collectors.groupingBy(EventUser::getRole, Collectors.counting()));
        return roleCounts.entrySet().stream()
                .map(entry -> ParticipantsByRoleDTO.builder()
                        .role(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationTimelineDTO> getRegistrationTimeline(Long eventId) {
        // Verify event exists
        eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);
        Map<LocalDate, Long> dateGrouping = eventUsers.stream()
                .filter(eu -> eu.getRegisteredAt() != null)
                .collect(Collectors.groupingBy(
                        eu -> eu.getRegisteredAt().toLocalDate(),
                        Collectors.counting()
                ));
        return dateGrouping.entrySet().stream()
                .map(entry -> RegistrationTimelineDTO.builder()
                        .date(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceRate(Long eventId) {
        // Verify event exists
        eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        List<EventUser> eventUsers = eventUserRepository.findByEventId(eventId);
        long approvedCount = eventUsers.stream()
                .filter(eu -> eu.getStatus() == EventUserStatus.APPROVED)
                .count();
        long finishedCount = eventUsers.stream()
                .filter(eu -> eu.getStatus() == EventUserStatus.FINISHED)
                .count();
        long unfinishedCount = eventUsers.stream()
                .filter(eu -> eu.getStatus() == EventUserStatus.UNFINISHED)
                .count();
        double attendanceRate = approvedCount > 0 ? (finishedCount * 100.0 / approvedCount) : 0.0;
        return Map.of(
                "eventId", eventId,
                "approvedCount", approvedCount,
                "finishedCount", finishedCount,
                "unfinishedCount", unfinishedCount,
                "attendanceRate", Math.round(attendanceRate * 100.0) / 100.0,
                "attendancePercentage", Math.round(attendanceRate * 100.0) / 100.0 + "%"
        );
    }
}
