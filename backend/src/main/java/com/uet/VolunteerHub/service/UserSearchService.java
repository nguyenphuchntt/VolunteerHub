package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.specification.UserSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;

@Log
@Service
public class UserSearchService {
    private final AccountRepository accountRepository;

    @Autowired
    public UserSearchService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    private UserSearchDTO mapToUserSearchDTO(Account account, UserInfo userInfo) {
        var builder = UserSearchDTO.builder()
                .accountID(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .status(account.getAccountStatus())
                .role(account.getRole())
                .createdAt(account.getCreateAt());

        if (userInfo != null) {
            builder.firstName(userInfo.getFirstName())
                    .lastName(userInfo.getLastName())
                    .dateOfBirth(userInfo.getDateOfBirth())
                    .country(userInfo.getCountry())
                    .city(userInfo.getCity())
                    .address(userInfo.getAddress())
                    .organization(userInfo.getOrganization());
        }
        return builder.build();
    }

    @Transactional
    public Optional<UserSearchDTO> findUserById(UUID accountId) {
        Optional<Account> account = accountRepository.findById(accountId);
        return account.map(value -> mapToUserSearchDTO(value, value.getUserInfo()));
    }

    @Transactional
    public Page<UserSearchDTO> findUsersBySpecification(UserSearchCriteriaDTO searchCriteria, Pageable pageable) {
        Specification<Account> spec = UserSpecification.fromCriteria(searchCriteria);
        Page<Account> accountPage = accountRepository.findAll(spec, pageable);
        return accountPage.map(account -> mapToUserSearchDTO(account, account.getUserInfo()));
    }

    public Page<UserSearchDTO> getUsersByRole(String role, Pageable pageable) {
        Specification<Account> spec = (root, query, cb) -> {
            if (role != null && !role.isEmpty()) {
                return cb.equal(root.get("role"), com.uet.VolunteerHub.enums.UserRole.valueOf(role));
            }
            return cb.conjunction();
        };
        Page<Account> accountPage = accountRepository.findAll(spec, pageable);
        return accountPage.map(account -> mapToUserSearchDTO(account, account.getUserInfo()));
    }
}
