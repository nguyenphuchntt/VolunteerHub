package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Follow;
import com.uet.VolunteerHub.entity.FollowId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FollowUserRepository extends JpaRepository<Follow, FollowId> {

    boolean existsByFollower_AccountIdAndFollowing_AccountId(UUID followerId, UUID followingId);

    long countByFollowing_AccountId(UUID accountId);

    long countByFollower_AccountId(UUID accountId);

    @EntityGraph(attributePaths = {"follower", "follower.userInfo", "following", "following.userInfo"})
    Page<Follow> findAllByFollower_AccountId(UUID accountId, Pageable pageable);

    @EntityGraph(attributePaths = {"follower", "follower.userInfo", "following", "following.userInfo"})
    Page<Follow> findAllByFollowing_AccountId(UUID accountId, Pageable pageable);
}
