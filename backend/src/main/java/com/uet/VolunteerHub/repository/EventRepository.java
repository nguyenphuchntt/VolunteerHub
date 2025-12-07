package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    @Override
    @EntityGraph(attributePaths = {"createdBy", "createdBy.userInfo"})
    Page<Event> findAll(Specification<Event> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"createdBy", "createdBy.userInfo"})
    Optional<Event> findById(Long eventId);

    List<Event> findAllByCreatedBy_AccountId(UUID accountID);

    @EntityGraph(attributePaths = {"createdBy", "createdBy.userInfo"})
    Page<Event> findAllByCreatedBy_AccountId(UUID accountId, Pageable pageable);

    Optional<Event> findByEventIdAndCreatedBy_AccountId(Long eventId, UUID accountId);

}
