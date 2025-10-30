package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.LikeId;
import com.uet.VolunteerHub.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, LikeId> {
    long countByPost_PostId(Long postId);
    boolean existsByPost_PostIdAndAccount_AccountId(Long postId, UUID accountId);
}
