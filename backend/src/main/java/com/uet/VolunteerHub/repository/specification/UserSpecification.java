package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.dto.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
   public static Specification<Account> userSearchCriteria(final UserSearchCriteriaDTO criteria) {
       return (root, query, criteriaBuilder) -> {
           List<Predicate> predicates = new ArrayList<>();
           Join<Account, UserInfo> userInfo = root.join("userInfo", JoinType.LEFT);

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

           return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
       };
   };


}
