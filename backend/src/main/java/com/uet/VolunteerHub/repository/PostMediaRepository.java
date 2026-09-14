package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.PostMedia;
import com.uet.VolunteerHub.entity.PostMediaId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, PostMediaId> {

    @EntityGraph(attributePaths = {"media"})
    Page<PostMedia> findAllByPost_PostId(Long postId, Pageable pageable);

    long countByPost_PostId(Long postId);
}
