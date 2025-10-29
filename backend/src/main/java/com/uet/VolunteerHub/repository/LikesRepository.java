package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.LikeID;
import com.uet.VolunteerHub.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikesRepository extends JpaRepository<Like, LikeID> {
}
