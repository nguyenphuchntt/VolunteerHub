package com.uet.VolunteerHub.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uet.VolunteerHub.dto.Account.AccountAdminCreateDTO;
import com.uet.VolunteerHub.dto.Account.AccountAdminPasswordChangeDTO;
import com.uet.VolunteerHub.dto.Account.AccountPasswordChangeDTO;
import com.uet.VolunteerHub.dto.Account.AccountPasswordDTO;
import com.uet.VolunteerHub.dto.Account.AccountRoleUpdateDTO;
import com.uet.VolunteerHub.dto.Account.AccountStatusUpdateDTO;
import com.uet.VolunteerHub.dto.Account.AccountUserRegisterDTO;
import com.uet.VolunteerHub.dto.Account.UserProfileUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.exception.ResourceAlreadyExistsException;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.EventUserRepository;

import jakarta.transaction.Transactional;
import lombok.extern.java.Log;

@Log
@Service
public class UserWriteService {
    private final AccountRepository accountRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventUserRepository eventUserRepository;

    @Autowired
    public UserWriteService(AccountRepository accountRepository, EventRepository eventRepository,
                            PasswordEncoder passwordEncoder, EventUserRepository eventUserRepository) {
        this.accountRepository = accountRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventUserRepository = eventUserRepository;
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
                    return new ResourceNotFoundException("Account with ID " + userID + " not found");
                });
        UserInfo userInfo = account.getUserInfo();
        if (userInfo == null) {
            throw new ResourceNotFoundException("User with ID " + userID + " not found");
        }
        return Pair.of(account, userInfo);
    }

    @Transactional
    public UserSearchDTO updateUserProfile(UserProfileUpdateDTO userProfileUpdateDTO, Account account) {
        UserInfo userInfo = account.getUserInfo();

        if (userProfileUpdateDTO.getEmail() != null && !account.getEmail().equals(userProfileUpdateDTO.getEmail())) {
            if (!accountRepository.existsByEmail(userProfileUpdateDTO.getEmail())) {
                account.setEmail(userProfileUpdateDTO.getEmail());
            } else {
                throw new ResourceAlreadyExistsException("Email " + userProfileUpdateDTO.getEmail() + " is already in use");
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

        return mapToUserSearchDTO(account, userInfo);
    }

    @Transactional
    public void deleteUser(Account account, AccountPasswordDTO accountPasswordDTO) {
        if (!passwordEncoder.matches(accountPasswordDTO.getPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }
        accountRepository.delete(account);
    }

    @Transactional
    public void deleteAccountById(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID: " + accountId + " not found"));
        accountRepository.delete(account);
    }

    @Transactional
    public UserSearchDTO changeAccountRole(UUID accountId, AccountRoleUpdateDTO accountRoleUpdateDTO) {
        Pair<Account, UserInfo> accountAndUserInfo = findAccountAndUserInfo(accountId);
        Account account = accountAndUserInfo.getFirst();
        if (accountRoleUpdateDTO.getRole() != null) {
            account.setRole(accountRoleUpdateDTO.getRole());
        }
        accountRepository.save(account);
        return mapToUserSearchDTO(account, accountAndUserInfo.getSecond());
    }

    @Transactional
    public UserSearchDTO changeAccountStatus(UUID accountId, AccountStatusUpdateDTO accountStatusUpdateDTO) {
        Pair<Account, UserInfo> accountAndUserInfo = findAccountAndUserInfo(accountId);
        Account account = accountAndUserInfo.getFirst();
        if (accountStatusUpdateDTO.getStatus() != null) {
            account.setAccountStatus(accountStatusUpdateDTO.getStatus());
        }
        accountRepository.save(account);
        return mapToUserSearchDTO(account, accountAndUserInfo.getSecond());
    }

    @Transactional
    public UserSearchDTO registerAccount(AccountUserRegisterDTO accountUserRegisterDTO) {
        if (!accountUserRegisterDTO.getConfirmPassword().equals(accountUserRegisterDTO.getPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }
        Account.AccountBuilder accountBuilder = Account.builder();
        accountBuilder.email(accountUserRegisterDTO.getEmail());
        accountBuilder.username(accountUserRegisterDTO.getUsername());
        accountBuilder.password(passwordEncoder.encode(accountUserRegisterDTO.getPassword()));
        accountBuilder.accountStatus(AccountStatus.ACTIVE);
        accountBuilder.role(UserRole.USER);
        Account account = accountBuilder.build();
        UserInfo userInfo = new UserInfo();
        try {
            userInfo.setAccount(account);
            account.setUserInfo(userInfo);
            accountRepository.save(account);
        } catch (DataIntegrityViolationException e) {
            String error = e.getMessage();
            if (error.contains("uk_account_email")) {
                throw new ResourceAlreadyExistsException("Email " + accountUserRegisterDTO.getEmail() + " is already in use");
            }
            if (error.contains("uk_account_username")) {
                throw new ResourceAlreadyExistsException("Username " + accountUserRegisterDTO.getUsername() + " is already in use");
            } else throw new RuntimeException("Error: " + error);
        }
        return mapToUserSearchDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO createAccount(AccountAdminCreateDTO accountAdminCreateDTO) {
        Account.AccountBuilder accountBuilder = Account.builder();
        accountBuilder.email(accountAdminCreateDTO.getEmail());
        accountBuilder.username(accountAdminCreateDTO.getUsername());
        accountBuilder.password(passwordEncoder.encode(accountAdminCreateDTO.getPassword()));
        if (accountAdminCreateDTO.getRole() != null) {
            accountBuilder.role(accountAdminCreateDTO.getRole());
        }
        if (accountAdminCreateDTO.getAccountStatus() != null) {
            accountBuilder.accountStatus(accountAdminCreateDTO.getAccountStatus());
        }
        Account account = accountBuilder.build();
        UserInfo userInfo = new UserInfo();
        try {
            userInfo.setAccount(account);
            account.setUserInfo(userInfo);
            accountRepository.save(account);
        } catch (DataIntegrityViolationException e) {
            String error = e.getMessage();
            if (error.contains("uk_account_email")) {
                throw new ResourceAlreadyExistsException("Email " + accountAdminCreateDTO.getEmail() + " is already in use");
            }
            if (error.contains("uk_account_username")) {
                throw new ResourceAlreadyExistsException("Username " + accountAdminCreateDTO.getUsername() + " is already in use");
            } else throw new RuntimeException("Error: " + error);
        }
        return mapToUserSearchDTO(account, userInfo);

    }

    @Transactional
    public void changePasswordUser(Account account, AccountPasswordChangeDTO accountPasswordChangeDTO) {
        if (!passwordEncoder.matches(accountPasswordChangeDTO.getOldPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (!accountPasswordChangeDTO.getNewPassword().equals(accountPasswordChangeDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match");
        }
        String encodedPassword = passwordEncoder.encode(accountPasswordChangeDTO.getNewPassword());
        account.setPassword(encodedPassword);
        accountRepository.save(account);
    }

    @Transactional
    public void changePasswordAdmin(UUID accountId, AccountAdminPasswordChangeDTO accountAdminPasswordChangeDTO) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID: " + accountId + " not found"));
        if (!accountAdminPasswordChangeDTO.getNewPassword().equals(accountAdminPasswordChangeDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match");
        }
        String encodedPassword = passwordEncoder.encode(accountAdminPasswordChangeDTO.getNewPassword());
        account.setPassword(encodedPassword);
        accountRepository.save(account);
    }

    @CacheEvict(value = "users", key = "#accountId")
    @Transactional
    public UserSearchDTO updateUserDetails(UUID accountId, UserProfileUpdateDTO userProfileUpdateDTO) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID: " + accountId + " not found"));
        UserInfo userInfo = account.getUserInfo();
        if (userProfileUpdateDTO.getEmail() != null && !account.getEmail().equals(userProfileUpdateDTO.getEmail())) {
            if (!accountRepository.existsByEmail(userProfileUpdateDTO.getEmail())) {
                account.setEmail(userProfileUpdateDTO.getEmail());
            } else {
                throw new ResourceAlreadyExistsException("Email " + userProfileUpdateDTO.getEmail() + " is already in use");
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

        return mapToUserSearchDTO(account, userInfo);
    }

}
