package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service("eventSecurityService")
public class EventSecurityService {
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public EventSecurityService(EventRepository eventRepository, AccountRepository accountRepository) {
        this.eventRepository = eventRepository;
        this.accountRepository = accountRepository;
    }

    public boolean isCreatorOfEvent(Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Account account)) return false;
        if (eventId == null) return false;
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        return eventOptional.map(event -> event.getCreatedBy().getAccountId().equals(account.getAccountId())).orElse(false);
    }

    public boolean isCreatorOfEvent(Long eventId, UUID accountId) {
        if (accountId == null) return false;
        if (eventId == null) return false;
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        return eventOptional.map(event -> event.getCreatedBy().getAccountId().equals(accountId)).orElse(false);
    }
}
