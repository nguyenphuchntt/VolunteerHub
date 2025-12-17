package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.AccountMedia;
import com.uet.VolunteerHub.entity.AccountMediaId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AccountMediaRepository extends JpaRepository<AccountMedia, AccountMediaId> {

    @EntityGraph(attributePaths = {"media"})
    Page<AccountMedia> findAllByAccount_AccountId(UUID accountId, Pageable pageable);
}
