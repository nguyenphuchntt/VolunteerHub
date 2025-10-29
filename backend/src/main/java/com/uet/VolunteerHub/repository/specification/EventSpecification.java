package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.dto.EventSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EventSpecification {
    public static Specification<Event> fromCriteria(EventSearchCriteriaDTO criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Event, Account> account = root.join("createdBy", JoinType.LEFT);

            if (criteria.getAccountId() != null) {
                predicates.add(criteriaBuilder.equal(account.get("accountId"), criteria.getAccountId()));
            }

            if (criteria.getEventId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("eventId"), criteria.getEventId()));
            }

            if (criteria.getTitle() != null) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" +criteria.getTitle().toLowerCase() + "%"));
            }

            if (criteria.getCreateAtFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createAt"), criteria.getCreateAtFrom()));
            }

            if (criteria.getCreateAtTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createAt"), criteria.getCreateAtTo()));
            }

            if (criteria.getStartAtFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startAt"), criteria.getStartAtFrom()));
            }

            if (criteria.getStartAtTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("startAt"), criteria.getStartAtTo()));
            }

            if (criteria.getEndAtFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("endAt"), criteria.getEndAtFrom()));
            }

            if (criteria.getEndAtTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endAt"), criteria.getEndAtTo()));
            }

            if (criteria.getCategory() != null) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), "%" + criteria.getCategory().toLowerCase() + "%"));
            }

            if (criteria.getLocation() != null) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + criteria.getLocation().toLowerCase() + "%"));
            }

            if (criteria.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), criteria.getStatus()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

    }
}
