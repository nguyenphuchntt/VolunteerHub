package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("eventSecurityService")
public class EventSecurityService {
    private final EventRepository eventRepository;

    @Autowired
    public EventSecurityService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public boolean isCreaterOfEvent(Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) return false;
        if (eventId == null) return false;
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        return eventOptional.map(event -> event.getCreatedBy().getAccountId().equals(account.getAccountId())).orElse(false);
    }
}
