package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserSearchDTO;
import com.uet.VolunteerHub.dto.UserProfileUpdateDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Log
@Service
public class UserWriteService {
    private final AccountRepository accountRepository;
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public UserWriteService(AccountRepository accountRepository, UserInfoRepository userInfoRepository) {
        this.accountRepository = accountRepository;
        this.userInfoRepository = userInfoRepository;
    }

    private UserSearchDTO mapToUserDTO(Account account, UserInfo userInfo) {
        UserSearchDTO.UserSearchDTOBuilder builder =  UserSearchDTO.builder()
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

//    private Pair<Account, UserInfo> getAccountAndUserInfo(UUID userID) {
//
//    }

    @Transactional
    public UserSearchDTO updateUser(UUID userID, UserProfileUpdateDTO userProfileUpdateDTO) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new EntityNotFoundException("Account with ID " + userID + " not found");
                });
        UserInfo userInfo = account.getUserInfo();
        if (userInfo == null) {
            throw new EntityNotFoundException("User with ID " + userID + " not found");
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
        if (userProfileUpdateDTO.getEmail() != null) {
            account.setEmail(userProfileUpdateDTO.getEmail());
        }
        return mapToUserDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO deleteUser(UUID userID) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new EntityNotFoundException("Account with ID " + userID + " not found");
                }
        );
        UserInfo userInfo = account.getUserInfo();
        if (userInfo == null) {
            throw new EntityNotFoundException("User with ID " + userID + " not found");
        }
        accountRepository.delete(account);
        return mapToUserDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO changeRole(UUID userID, UserRole newRole) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new EntityNotFoundException("Account with ID " + userID + " not found");
                }
        );
        UserInfo userInfo = account.getUserInfo();
        account.setRole(newRole);
        accountRepository.save(account);
        return mapToUserDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO changeAccountStatus(UUID userID, AccountStatus newStatus) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new EntityNotFoundException("Account with ID " + userID + " not found");
                }
        );
        UserInfo userInfo = account.getUserInfo();
        account.setAccountStatus(newStatus);
        accountRepository.save(account);
        return mapToUserDTO(account, userInfo);
    }


}
