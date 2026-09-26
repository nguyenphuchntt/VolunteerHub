package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.common.pagination.CursorKey;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.enums.PostStatus;
import jakarta.persistence.criteria.Path;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Instant;

@Component
public class PostSpecification {

    /**
     * Time column the post listings are ordered by. Note the entity field is named {@code createAt}
     * — not {@code createdAt} as on every other entity — so this string must stay in sync with
     * {@code Post.createAt}, not with the underlying {@code created_at} column name.
     */
    public static final String SORT_FIELD_TIME = "createAt";

    /** Primary-key tie-breaker: {@code created_at} alone is not unique. */
    public static final String SORT_FIELD_ID = "postId";

    public Specification<Post> contentLike(String content) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(content)) {
                return null;
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("content")), "%" + content.toLowerCase() + "%"
            );
        };
    }

    public Specification<Post> hasOwner(String ownerUsername) {
        return (root, query, criteriaBuilder) -> {
            if (ownerUsername == null) {
                return null;
            }
            return criteriaBuilder.equal(
                    root.get("createdByAccount").get("username"),
                    ownerUsername
            );
        };
    }

    public Specification<Post> isInEvent(Long eventId) {
        return (root, query, criteriaBuilder) -> {
            if (eventId == null) {
                return null;
            }
            return criteriaBuilder.equal(
                    root.get("event").get("eventId"),
                    eventId
            );
        };
    }

    // Filter out DELETED posts
    public Specification<Post> isNotDeleted() {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.notEqual(root.get("postStatus"), PostStatus.DELETED);
    }

    /**
     * Keyset condition selecting only the rows that come strictly after {@code key} in the listing's
     * sort order.
     *
     * <p>Expanded tuple comparison — {@code (createAt, postId) < (?, ?)} for DESC — because JPQL/Criteria
     * has no row-value comparison. The two branches are exactly equivalent to the tuple form: strictly
     * older timestamps, plus same-timestamp rows with a smaller id. The id tie-breaker matters because
     * {@code created_at} is not unique: several rows can share a timestamp, and without the tie-breaker
     * a keyset query would either repeat or skip them.
     *
     * @param key       position of the last row of the previous page; {@code null} on the first page,
     *                  in which case the returned specification imposes no condition
     * @param direction direction the listing is sorted in; must match the {@code Sort} passed alongside
     * @return a specification that is a no-op when {@code key} is {@code null}
     */
    public Specification<Post> cursorAfter(CursorKey key, Sort.Direction direction) {
        return (root, query, criteriaBuilder) -> {
            if (key == null) {
                return null;
            }
            Path<Instant> timePath = root.get(SORT_FIELD_TIME);
            Path<Long> idPath = root.get(SORT_FIELD_ID);

            if (Sort.Direction.ASC.equals(direction)) {
                return criteriaBuilder.or(
                        criteriaBuilder.greaterThan(timePath, key.sortValue()),
                        criteriaBuilder.and(
                                criteriaBuilder.equal(timePath, key.sortValue()),
                                criteriaBuilder.greaterThan(idPath, key.id())
                        )
                );
            }

            return criteriaBuilder.or(
                    criteriaBuilder.lessThan(timePath, key.sortValue()),
                    criteriaBuilder.and(
                            criteriaBuilder.equal(timePath, key.sortValue()),
                            criteriaBuilder.lessThan(idPath, key.id())
                    )
            );
        };
    }
}

