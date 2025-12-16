package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.dto.Account.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
   public static Specification<Account> fromCriteria(final UserSearchCriteriaDTO criteria) {
       return (root, query, criteriaBuilder) -> {
           List<Predicate> predicates = new ArrayList<>();
           Join<Account, UserInfo> userInfo = root.join("userInfo", JoinType.LEFT);

           if (criteria.getUserId() != null) {
               predicates.add(criteriaBuilder.equal(userInfo.get("accountId"), criteria.getUserId()));
           }
           if(criteria.getUsername() != null) {
               predicates.add(criteriaBuilder.equal(root.get("username"), criteria.getUsername()));
           }

           if(criteria.getEmail() != null) {
               predicates.add(criteriaBuilder.equal(root.get("email"), criteria.getEmail()));
           }

           if(criteria.getRole() != null) {
               predicates.add(criteriaBuilder.equal(root.get("role"), criteria.getRole()));
           }

           if(criteria.getAccountStatus() != null) {
               predicates.add(criteriaBuilder.equal(root.get("accountStatus"), criteria.getAccountStatus()));
           }

           if(criteria.getFirstName() != null) {
               predicates.add(criteriaBuilder.like(criteriaBuilder.lower(userInfo.get("firstName")), "%" + criteria.getFirstName().toLowerCase() + "%"));
           }

           if(criteria.getLastName() != null) {
               predicates.add(criteriaBuilder.like(criteriaBuilder.lower(userInfo.get("lastName")), "%" + criteria.getLastName().toLowerCase() + "%"));
           }

           if(criteria.getOrganization() != null) {
               predicates.add(criteriaBuilder.equal(userInfo.get("organization"), criteria.getOrganization()));
           }

           if(criteria.getCountry() != null) {
               predicates.add(criteriaBuilder.equal(userInfo.get("country"), criteria.getCountry()));
           }

           if(criteria.getCity() != null) {
               predicates.add(criteriaBuilder.equal(userInfo.get("city"), criteria.getCity()));
           }

           if (criteria.getDateOfBirthFrom() != null) {
               predicates.add(criteriaBuilder.greaterThanOrEqualTo(userInfo.get("dateOfBirth"), criteria.getDateOfBirthFrom()));
           }

           if (criteria.getDateOfBirthTo() != null) {
               predicates.add(criteriaBuilder.lessThanOrEqualTo(userInfo.get("dateOfBirth"), criteria.getDateOfBirthTo()));
           }

           if (criteria.getCreateAtFrom() != null) {
               predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createAt"), criteria.getCreateAtFrom()));
           }

           if (criteria.getCreateAtTo() != null) {
               predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createAt"), criteria.getCreateAtTo()));
           }

           return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
       };
   };


}
