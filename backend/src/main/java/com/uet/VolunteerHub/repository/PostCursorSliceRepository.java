package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

/**
 * Custom fragment giving {@link PostRepository} keyset-pagination reads that do not trigger a
 * {@code COUNT(*)} query. Implemented by {@link PostCursorSliceRepositoryImpl}.
 */
public interface PostCursorSliceRepository {

    /**
     * @param spec  dynamic filter (may be {@code null})
     * @param sort  ordering including the tie-breaker
     * @param limit maximum rows to fetch; pass {@code size + 1} for the probe-row trick
     * @return ordered rows, at most {@code limit}
     */
    List<Post> findSlice(Specification<Post> spec, Sort sort, int limit);
}
