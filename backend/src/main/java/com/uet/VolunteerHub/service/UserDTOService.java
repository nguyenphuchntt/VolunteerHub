package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserDTO;
import com.uet.VolunteerHub.dto.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import com.uet.VolunteerHub.repository.specification.UserSpecification;
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
public class UserDTOService {
    private final AccountRepository accountRepository;
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public UserDTOService(AccountRepository accountRepository, UserInfoRepository userInfoRepository) {
        this.accountRepository = accountRepository;
        this.userInfoRepository = userInfoRepository;
    }

    private UserDTO mapToUserDTO(Account account, UserInfo userInfo) {
        return new UserDTO(
                account.getAccountId(),
                account.getUsername(),
                account.getEmail(),
                account.getAccountStatus(),
                account.getRole(),
                userInfo.getFirstName(),
                userInfo.getLastName(),
                userInfo.getDateOfBirth(),
                userInfo.getCountry(),
                userInfo.getCity(),
                userInfo.getAddress(),
                userInfo.getOrganization(),
                account.getCreateAt()
        );
    }

    @Transactional
    public Optional<UserDTO> findUserById(UUID accountId) {
        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            return Optional.of(mapToUserDTO(account.get(), account.get().getUserInfo()));
        }
        log.warning("Account not found for accountId " + accountId);
        return Optional.empty();
    }

    @Transactional
    public Page<UserDTO> findUsersBySpecification(UserSearchCriteriaDTO searchCriteria, Pageable pageable) {
        Specification<Account> spec = UserSpecification.userSearchCriteria(searchCriteria);
        Page<Account> accountPage = accountRepository.findAll(spec, pageable);
        if (accountPage.hasContent()) {
            return accountPage.map(account -> mapToUserDTO(account, account.getUserInfo()));
        } else {
            log.warning("No users found for specified search criteria " + searchCriteria.toString());
            return Page.empty(pageable);
        }
    }



}
