package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserSearchDTO;
import com.uet.VolunteerHub.dto.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.specification.UserSpecification;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    private UserSearchDTO mapToUserDTO(Account account, UserInfo userInfo) {
        return UserSearchDTO.builder()
                .accountID(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .status(account.getAccountStatus())
                .role(account.getRole())
                .createdAt(account.getCreateAt())
                .firstName(userInfo.getFirstName())
                .lastName(userInfo.getLastName())
                .dateOfBirth(userInfo.getDateOfBirth())
                .country(userInfo.getCountry())
                .city(userInfo.getCity())
                .address(userInfo.getAddress())
                .organization(userInfo.getOrganization())
                .build();
    }

    @Transactional
    public Optional<UserSearchDTO> findUserById(UUID accountId) {
        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            if (account.get().getUserInfo() != null) {
                return Optional.of(mapToUserDTO(account.get(), account.get().getUserInfo()));
            }
        }
        log.warning("Account not found for accountId " + accountId);
        return Optional.empty();
    }

    @Transactional
    public Page<UserSearchDTO> findUsersBySpecification(UserSearchCriteriaDTO searchCriteria, Pageable pageable) {
        Specification<Account> spec = UserSpecification.userSearchCriteria(searchCriteria);
        Page<Account> accountPage = accountRepository.findAll(spec, pageable);
        return accountPage.map(account -> mapToUserDTO(account, account.getUserInfo()));


    }

}
