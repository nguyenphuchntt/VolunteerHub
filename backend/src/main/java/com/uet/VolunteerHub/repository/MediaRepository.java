package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {
    Page<Media> findAllByOwner_AccountId(UUID accountId, Pageable pageable);
}
