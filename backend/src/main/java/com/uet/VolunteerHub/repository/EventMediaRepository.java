package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.EventMedia;
import com.uet.VolunteerHub.entity.EventMediaId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventMediaRepository extends JpaRepository<EventMedia, EventMediaId> {

    @EntityGraph(attributePaths = {"media"})
    Page<EventMedia> findAllByEvent_EventId(Long eventId, Pageable pageable);
    
    // Get first media for an event (cover image)
    @EntityGraph(attributePaths = {"media"})
    Optional<EventMedia> findFirstByEvent_EventIdOrderByMedia_UploadedAtAsc(Long eventId);
}
