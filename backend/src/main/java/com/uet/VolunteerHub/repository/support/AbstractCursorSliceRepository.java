package com.uet.VolunteerHub.repository.support;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Keyset-pagination query support for a single entity type.
 *
 * <p>Why this exists: {@code JpaSpecificationExecutor} only offers {@code findAll(Specification,
 * Pageable)}, which returns {@code Page} — and building a {@code Page} runs a {@code COUNT(*)}
 * query. That count is precisely the cost keyset pagination is meant to remove. This fragment runs
 * the same dynamic {@link Specification} but with a plain {@code setMaxResults}, so no count query
 * is issued.
 *
 * <p>Spring Data cannot instantiate a fragment implementation that takes only {@code Class<T>} as a
 * constructor argument, hence the per-entity subclass pattern: a concrete
 * {@code <Entity>CursorSliceRepositoryImpl} extends this class and supplies its domain type.
 *
 * @param <T> entity type
 */
public abstract class AbstractCursorSliceRepository<T> {

    private final EntityManager entityManager;
    private final Class<T> domainType;

    protected AbstractCursorSliceRepository(EntityManager entityManager, Class<T> domainType) {
        this.entityManager = entityManager;
        this.domainType = domainType;
    }

    /**
     * Fetch one page of rows, ordered by {@code sort} and capped at {@code limit}.
     *
     * <p>Callers pass {@code limit = size + 1} and treat the extra row as a
     * "there is more" probe — see {@code CursorSliceMapper}.
     *
     * @param spec  dynamic filter; may be {@code null} or yield a {@code null} predicate
     * @param sort  ordering, including the primary-key tie-breaker
     * @param limit maximum number of rows to return
     * @return matching rows, ordered
     */
    public List<T> findSlice(Specification<T> spec, Sort sort, int limit) {
        if (limit < 1) {
            throw new IllegalArgumentException("limit must be positive but was " + limit);
        }

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(domainType);
        Root<T> root = criteriaQuery.from(domainType);

        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, criteriaQuery, criteriaBuilder);
            if (predicate != null) {
                criteriaQuery.where(predicate);
            }
        }

        if (sort != null && sort.isSorted()) {
            criteriaQuery.orderBy(QueryUtils.toOrders(sort, root, criteriaBuilder));
        }

        TypedQuery<T> query = entityManager.createQuery(criteriaQuery);
        query.setMaxResults(limit);
        return query.getResultList();
    }
}
