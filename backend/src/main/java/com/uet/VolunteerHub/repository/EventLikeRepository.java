package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.EventLike;
import com.uet.VolunteerHub.entity.EventLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventLikeRepository extends JpaRepository<EventLike, EventLikeId> {
    long countByEventId(long eventId);

    boolean existsByEventIdAndAccountId(long eventId, UUID accountId);

    void deleteByEventIdAndAccountId(long eventId, UUID accountId);
}
