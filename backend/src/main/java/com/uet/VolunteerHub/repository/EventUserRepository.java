package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.EventUserId;
import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventUserRepository
                extends JpaRepository<EventUser, EventUserId>, JpaSpecificationExecutor<EventUser> {

        @Override
        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findAll(Specification<EventUser> spec, Pageable pageable);

        @Override
        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Optional<EventUser> findById(EventUserId id);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Optional<EventUser> findByAccountIdAndEventId(UUID accountID, Long eventId);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findByAccountId(UUID accountID, Pageable pageable);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findByEventId(Long eventId, Pageable pageable);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findByStatus(EventUserStatus status, Pageable pageable);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findByAccountIdAndStatus(UUID accountId, EventUserStatus status, Pageable pageable);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findByEventIdAndStatus(Long eventId, EventUserStatus status, Pageable pageable);

        void deleteByAccountIdAndEventId(UUID accountID, Long eventId);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        List<EventUser> findByAccountId(UUID accountID);

        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        List<EventUser> findByEventId(Long eventId);

        @Query("SELECT eu.account, COUNT(eu) as count FROM EventUser eu GROUP BY eu.account ORDER BY count DESC")
        List<Object[]> findTopActiveUsers(Pageable pageable);

        @Query("SELECT eu FROM EventUser eu " +
                        "WHERE eu.status = :status " +
                        "AND eu.eventId IN (" +
                        "  SELECT eu2.eventId FROM EventUser eu2 " +
                        "  WHERE eu2.accountId = :managerId " +
                        "  AND eu2.role = com.uet.VolunteerHub.enums.EventUserRole.MANAGER" +
                        ")")
        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findPendingUsersByManagerId(UUID managerId, EventUserStatus status, Pageable pageable);

        @Query("SELECT CASE WHEN COUNT(eu) > 0 THEN true ELSE false END " +
                        "FROM EventUser eu " +
                        "WHERE eu.accountId = :accountId " +
                        "AND eu.role = com.uet.VolunteerHub.enums.EventUserRole.MANAGER")
        boolean isEventManager(UUID accountId);

        @Query("SELECT eu FROM EventUser eu " +
                        "WHERE eu.eventId = :eventId " +
                        "AND eu.status = com.uet.VolunteerHub.enums.EventUserStatus.APPROVED")
        List<EventUser> findApprovedEventUser(@Param("eventId") Long eventId);

        @Query("SELECT eu FROM EventUser eu " +
                        "WHERE eu.accountId = :accountId " +
                        "AND eu.role = com.uet.VolunteerHub.enums.EventUserRole.MANAGER")
        @EntityGraph(attributePaths = { "account", "account.userInfo", "event" })
        Page<EventUser> findManagedEventsByAccountId(@Param("accountId") UUID accountId, Pageable pageable);

        /**
         * Efficiently count users by event and role without loading entities.
         */
        @Query("SELECT COUNT(eu) FROM EventUser eu WHERE eu.eventId = :eventId AND eu.role = :role")
        long countByEventIdAndRole(@Param("eventId") Long eventId, @Param("role") EventUserRole role);

        /**
         * Check if an account has a specific role in an event.
         */
        boolean existsByAccount_AccountIdAndEvent_EventIdAndRole(UUID accountId, Long eventId, EventUserRole role);

        /**
         * Efficiently count users by event and status without loading entities.
         */
        @Query("SELECT COUNT(eu) FROM EventUser eu WHERE eu.eventId = :eventId AND eu.status = :status")
        long countByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") EventUserStatus status);

}
