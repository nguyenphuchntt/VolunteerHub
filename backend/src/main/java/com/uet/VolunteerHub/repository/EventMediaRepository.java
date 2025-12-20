package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.EventMedia;
import com.uet.VolunteerHub.entity.EventMediaId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventMediaRepository extends JpaRepository<EventMedia, EventMediaId> {

    @EntityGraph(attributePaths = { "media" })
    Page<EventMedia> findAllByEvent_EventId(Long eventId, Pageable pageable);

    // Get first media for an event (cover image)
    @EntityGraph(attributePaths = { "media" })
    Optional<EventMedia> findFirstByEvent_EventIdOrderByMedia_UploadedAtAsc(Long eventId);

    /**
     * Batch fetch first media for multiple events (avoids N+1 query problem).
     * Uses a subquery to get the earliest uploaded media for each event.
     */
    @Query(value = """
            SELECT em.* FROM event_media em
            INNER JOIN media m ON em.media_id = m.id
            WHERE em.event_id IN :eventIds
            AND m.uploaded_at = (
                SELECT MIN(m2.uploaded_at)
                FROM event_media em2
                INNER JOIN media m2 ON em2.media_id = m2.id
                WHERE em2.event_id = em.event_id
            )
            """, nativeQuery = true)
    List<EventMedia> findFirstMediaByEventIds(@Param("eventIds") List<Long> eventIds);
}
