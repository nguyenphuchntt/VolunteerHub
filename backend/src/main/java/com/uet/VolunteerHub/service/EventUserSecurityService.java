package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.repository.EventUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("eventUserSecurityService")
public class EventUserSecurityService {
    private final EventUserRepository eventUserRepository;
    @Autowired
    public EventUserSecurityService(EventUserRepository eventUserRepository) {
        this.eventUserRepository = eventUserRepository;
    }
    public boolean isManager(Long eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Account account)) {
            return false;
        }
        EventUser eventUser = eventUserRepository.findByAccountIdAndEventId(account.getAccountId(), eventId).orElse(null);
        if (eventUser == null) return false;
        return eventUser.getRole().equals(EventUserRole.MANAGER);
    }
}
