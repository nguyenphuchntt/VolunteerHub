package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.LikeId;
import com.uet.VolunteerHub.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<PostLike, LikeId> {
}
