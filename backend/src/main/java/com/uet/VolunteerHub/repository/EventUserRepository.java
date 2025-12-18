package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.EventUserId;
import com.uet.VolunteerHub.enums.EventUserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventUserRepository extends JpaRepository<EventUser, EventUserId>, JpaSpecificationExecutor<EventUser> {

    @Override
    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findAll(Specification<EventUser> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Optional<EventUser> findById(EventUserId id);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Optional<EventUser> findByAccountIdAndEventId(UUID accountID, Long eventId);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findByAccountId(UUID accountID, Pageable pageable);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findByEventId(Long eventId, Pageable pageable);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findByStatus(EventUserStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findByAccountIdAndStatus(UUID accountId, EventUserStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    Page<EventUser> findByEventIdAndStatus(Long eventId, EventUserStatus status, Pageable pageable);

    void deleteByAccountIdAndEventId(UUID accountID, Long eventId);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    List<EventUser> findByAccountId(UUID accountID);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "event"})
    List<EventUser> findByEventId(Long eventId);

    @Query("SELECT eu.account, COUNT(eu) as count FROM EventUser eu GROUP BY eu.account ORDER BY count DESC")
    List<Object[]> findTopActiveUsers(Pageable pageable);

    List<EventUser> getAllEventUsersByEventId(Long eventId);

    List<EventUser> getAllEventUsersByAccountId(UUID accountId);

    List<EventUser> getAllEventUsers();

}
