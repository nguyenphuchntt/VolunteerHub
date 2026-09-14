package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.dto.EventUser.EventUserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.EventUser;
import com.uet.VolunteerHub.entity.Profile;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EventUserSpecification {
    public static Specification<EventUser> fromCriteria(EventUserSearchCriteriaDTO criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getEventId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("eventId"), criteria.getEventId()));
            }

            if (criteria.getAccountId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("accountId"), criteria.getAccountId()));
            }

            if (criteria.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getRole() != null) {
                predicates.add(criteriaBuilder.equal(root.get("role"), criteria.getRole()));
            }

            if (criteria.getRegisteredAtFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("registeredAt"), criteria.getRegisteredAtFrom()));
            }

            if (criteria.getRegisteredAtTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("registeredAt"), criteria.getRegisteredAtTo()));
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

            if (criteria.getFirstName() != null || criteria.getLastName() != null) {
                Join<EventUser, Account> account = root.join("account", JoinType.LEFT);
                Join<Account, Profile> userInfo = account.join("userInfo", JoinType.LEFT);

                if (criteria.getFirstName() != null) {
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(userInfo.get("firstName")), 
                        "%" + criteria.getFirstName().toLowerCase() + "%"
                    ));
                }

                if (criteria.getLastName() != null) {
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(userInfo.get("lastName")), 
                        "%" + criteria.getLastName().toLowerCase() + "%"
                    ));
                }
            }

            if (criteria.getEventTitle() != null || criteria.getEventLocation() != null) {
                Join<EventUser, Event> event = root.join("event", JoinType.LEFT);

                if (criteria.getEventTitle() != null) {
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(event.get("title")), 
                        "%" + criteria.getEventTitle().toLowerCase() + "%"
                    ));
                }

                if (criteria.getEventLocation() != null) {
                    predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(event.get("location")), 
                        "%" + criteria.getEventLocation().toLowerCase() + "%"
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
