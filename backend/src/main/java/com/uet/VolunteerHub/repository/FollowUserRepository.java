package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.FollowUser;
import com.uet.VolunteerHub.entity.FollowUserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FollowUserRepository extends JpaRepository<FollowUser, FollowUserId> {

    boolean existsByAccount_AccountIdAndFollowedByAccount_AccountId(UUID accountId, UUID followedByAccountId);

    long countByAccount_AccountId(UUID accountId);

    long countByFollowedByAccount_AccountId(UUID followedByAccountId);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "followedByAccount", "followedByAccount.userInfo"})
    Page<FollowUser> findAllByFollowedByAccount_AccountId(UUID followedByAccountId, Pageable pageable);

    @EntityGraph(attributePaths = {"account", "account.userInfo", "followedByAccount", "followedByAccount.userInfo"})
    Page<FollowUser> findAllByAccount_AccountId(UUID accountId, Pageable pageable);
}
