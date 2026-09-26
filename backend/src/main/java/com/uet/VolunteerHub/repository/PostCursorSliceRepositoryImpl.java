package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.repository.support.AbstractCursorSliceRepository;
import jakarta.persistence.EntityManager;

/**
 * Binds {@link Post} to {@link AbstractCursorSliceRepository}. Must live in the same package as
 * {@link PostRepository} for Spring Data to pick it up as a fragment implementation.
 *
 * <p>Deliberately not annotated as a bean: Spring Data instantiates fragment implementations itself
 * and autowires their constructor, so an extra {@code @Repository} would only add a duplicate bean
 * definition to resolve.
 */
public class PostCursorSliceRepositoryImpl extends AbstractCursorSliceRepository<Post>
        implements PostCursorSliceRepository {

    public PostCursorSliceRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Post.class);
    }
}
