package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserSearchDTO;
import com.uet.VolunteerHub.dto.UserProfileUpdateDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Log
@Service
public class UserWriteService {
    private final AccountRepository accountRepository;
    private final UserInfoRepository userInfoRepository;
    private final EventRepository eventRepository;

    @Autowired
    public UserWriteService(AccountRepository accountRepository, UserInfoRepository userInfoRepository, EventRepository eventRepository) {
        this.accountRepository = accountRepository;
        this.userInfoRepository = userInfoRepository;
        this.eventRepository = eventRepository;
    }

    private UserSearchDTO mapToUserSearchDTO(Account account, UserInfo userInfo) {
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
                .organization(userInfo.getOrganization()).build();

    }

    @Transactional
    protected Pair<Account, UserInfo> findAccountAndUserInfo(UUID userID) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new EntityNotFoundException("Account with ID " + userID + " not found");
                });
        UserInfo userInfo = account.getUserInfo();
        if (userInfo == null) {
            throw new EntityNotFoundException("User with ID " + userID + " not found");
        }
        return Pair.of(account, userInfo);
    }

    @Transactional
    public UserSearchDTO updateUser(UUID userID, UserProfileUpdateDTO userProfileUpdateDTO) {
        Pair<Account, UserInfo> AccountAndUserInfo = findAccountAndUserInfo(userID);
        Account account = AccountAndUserInfo.getFirst();
        UserInfo userInfo = AccountAndUserInfo.getSecond();

        if (userProfileUpdateDTO.getEmail() != null && !account.getEmail().equals(userProfileUpdateDTO.getEmail())) {
            if (!accountRepository.existsByEmail(userProfileUpdateDTO.getEmail())) {
                account.setEmail(userProfileUpdateDTO.getEmail());
            } else {
                throw new IllegalArgumentException("Email " + userProfileUpdateDTO.getEmail() + " is already in use");
            }
        }
        if (userProfileUpdateDTO.getFirstName() != null) {
            userInfo.setFirstName(userProfileUpdateDTO.getFirstName());
        }
        if (userProfileUpdateDTO.getLastName() != null) {
            userInfo.setLastName(userProfileUpdateDTO.getLastName());
        }
        if (userProfileUpdateDTO.getDateOfBirth() != null) {
            userInfo.setDateOfBirth(userProfileUpdateDTO.getDateOfBirth());
        }
        if (userProfileUpdateDTO.getCountry() != null) {
            userInfo.setCountry(userProfileUpdateDTO.getCountry());
        }
        if (userProfileUpdateDTO.getCity() != null) {
            userInfo.setCity(userProfileUpdateDTO.getCity());
        }
        if (userProfileUpdateDTO.getAddress() != null) {
            userInfo.setAddress(userProfileUpdateDTO.getAddress());
        }
        if (userProfileUpdateDTO.getOrganization() != null) {
            userInfo.setOrganization(userProfileUpdateDTO.getOrganization());
        }

        accountRepository.save(account);
        userInfoRepository.save(userInfo);

        return mapToUserSearchDTO(account, userInfo);
    }

    @Transactional
    public void deleteUser(UUID userID) {
        Pair<Account, UserInfo> AccountAndUserInfo = findAccountAndUserInfo(userID);
        Account account = AccountAndUserInfo.getFirst();
        UserInfo userInfo = AccountAndUserInfo.getSecond();
        List<Event> eventList = eventRepository.findAllByCreatedBy_AccountId(userID);
        for(Event event : eventList) {
            event.setCreatedBy(null);
        }
    }

    @Transactional
    public UserSearchDTO changeRole(UUID userID, UserRole newRole) {
        Pair<Account, UserInfo> AccountAndUserInfo = findAccountAndUserInfo(userID);
        Account account = AccountAndUserInfo.getFirst();
        UserInfo userInfo = AccountAndUserInfo.getSecond();
        account.setRole(newRole);
        accountRepository.save(account);
        return mapToUserSearchDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO changeAccountStatus(UUID userID, AccountStatus newStatus) {
        Pair<Account, UserInfo> AccountAndUserInfo = findAccountAndUserInfo(userID);
        Account account = AccountAndUserInfo.getFirst();
        UserInfo userInfo = AccountAndUserInfo.getSecond();
        account.setAccountStatus(newStatus);
        accountRepository.save(account);
        return mapToUserSearchDTO(account, userInfo);
    }



}
