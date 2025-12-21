package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Event;

import com.uet.VolunteerHub.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    @Override
    @EntityGraph(attributePaths = { "createdBy", "createdBy.userInfo" })
    Page<Event> findAll(Specification<Event> spec, Pageable pageable);

    @EntityGraph(attributePaths = { "createdBy", "createdBy.userInfo" })
    Optional<Event> findByEventIdOrderByStartAt(Long eventId);

    List<Event> findAllByCreatedBy_AccountId(UUID accountID);

    @EntityGraph(attributePaths = { "createdBy", "createdBy.userInfo" })
    Page<Event> findAllByCreatedBy_AccountId(UUID accountId, Pageable pageable);

    Optional<Event> findByEventIdAndCreatedBy_AccountId(Long eventId, UUID accountId);

    long countByStatus(EventStatus status);

    List<Event> findTop5ByOrderByLikeCountDesc();

    @Query("SELECT e.category, COUNT(e) FROM Event e GROUP BY e.category")
    List<Object[]> countEventsByCategory();

    @Query("SELECT DATE(e.createAt) as date, COUNT(e) as count FROM Event e WHERE e.createAt >= :startDate GROUP BY DATE(e.createAt) ORDER BY date ASC")
    List<Object[]> countNewEventsByDate(java.time.OffsetDateTime startDate);

    @Query("SELECT SUM(e.attendeeCount) FROM Event e")
    Long sumAttendeeCount();

    List<Event> findAllByStatus(EventStatus status);

    @Query(value = """
                SELECT e FROM Event e
                WHERE e.status IN ('SCHEDULED', 'STARTED')
                ORDER BY (
                    (CAST(e.likeCount AS double) / GREATEST(1, FUNCTION('DATEDIFF', CURRENT_DATE, CAST(e.createAt AS date)))) * 0.5 +
                    (CAST(e.attendeeCount AS double) / GREATEST(1, FUNCTION('DATEDIFF', CURRENT_DATE, CAST(e.createAt AS date)))) * 0.5
                ) DESC
            """, countQuery = """
                SELECT COUNT(e) FROM Event e
                WHERE e.status IN ('SCHEDULED', 'STARTED')
            """)
    @EntityGraph(attributePaths = { "createdBy", "createdBy.userInfo" })
    Page<Event> findHotEvents(Pageable pageable);

    @Query(value = """
                SELECT e FROM Event e
                WHERE e.status IN ('SCHEDULED', 'STARTED')
                AND e.category = :category
                ORDER BY (
                    (CAST(e.likeCount AS double) / GREATEST(1, FUNCTION('DATEDIFF', CURRENT_DATE, CAST(e.createAt AS date)))) * 0.5 +
                    (CAST(e.attendeeCount AS double) / GREATEST(1, FUNCTION('DATEDIFF', CURRENT_DATE, CAST(e.createAt AS date)))) * 0.5
                ) DESC
            """, countQuery = """
                SELECT COUNT(e) FROM Event e
                WHERE e.status IN ('SCHEDULED', 'STARTED')
                AND e.category = :category
            """)
    @EntityGraph(attributePaths = { "createdBy", "createdBy.userInfo" })
    Page<Event> findHotEventsByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT e FROM Event e " +
            "WHERE e.startAt BETWEEN :start AND :end " +
            "AND e.status = com.uet.VolunteerHub.enums.EventStatus.SCHEDULED " +
            "ORDER BY e.startAt ASC")
    List<Event> findScheduledEventsBetweenTimes(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query(value = "SELECT * FROM event e " +
            "WHERE MATCH(e.title) AGAINST(CONCAT(:query, '*') IN BOOLEAN MODE) " +
            "AND e.status IN ('SCHEDULED', 'STARTED') " +
            "ORDER BY e.like_count DESC", nativeQuery = true)
    List<Event> findSuggestionsByTitle(@Param("query") String query, Pageable pageable);

}
