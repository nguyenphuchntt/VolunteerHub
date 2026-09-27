package com.uet.VolunteerHub.service;

import java.util.UUID;

import com.uet.VolunteerHub.entity.Profile;
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
import com.uet.VolunteerHub.dto.Account.UserProfileUpdateDTO;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.exception.ResourceAlreadyExistsException;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;

import jakarta.transaction.Transactional;
import lombok.extern.java.Log;

/**
 * Service for user write operations (create, update, delete)
 */
@Log
@Service
public class UserWriteService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserWriteService(AccountRepository accountRepository,
                            PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UserSearchDTO mapToUserSearchDTO(Account account, Profile userInfo) {
        return UserSearchDTO.builder()
                .accountID(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .status(account.getAccountStatus())
                .role(account.getRole())
                .createdAt(account.getCreatedAt())
                .firstName(userInfo.getFirstName())
                .lastName(userInfo.getLastName())
                .dateOfBirth(userInfo.getDateOfBirth())
                .country(userInfo.getCountry())
                .city(userInfo.getCity())
                .address(userInfo.getAddress())
                .organization(userInfo.getOrganization()).build();

    }

    @Transactional
    protected Pair<Account, Profile> findAccountAndUserInfo(UUID userID) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> {
                    log.warning("Account with ID " + userID + " not found");
                    return new ResourceNotFoundException("Account with ID " + userID + " not found");
                });
        Profile userInfo = account.getUserInfo();
        if (userInfo == null) {
            throw new ResourceNotFoundException("User with ID " + userID + " not found");
        }
        return Pair.of(account, userInfo);
    }

    /**
     * Updates authenticated user's profile information.
     * Validates email uniqueness if email is being changed.
     * 
     * @param userProfileUpdateDTO profile update data
     * @param account the authenticated account to update
     * @return UserSearchDTO with updated profile
     * @throws ResourceAlreadyExistsException if new email already in use
     */
    @CacheEvict(value = "users", key = "#account.accountId")
    @Transactional
    public UserSearchDTO updateUserProfile(UserProfileUpdateDTO userProfileUpdateDTO, Account account) {
        Profile userInfo = account.getUserInfo();

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

    @CacheEvict(value = "users", key = "#account.accountId")
    @Transactional
    public void deleteUser(Account account, AccountPasswordDTO accountPasswordDTO) {
        if (!passwordEncoder.matches(accountPasswordDTO.getPassword(), account.getPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }
        accountRepository.delete(account);
    }

    @CacheEvict(value = "users", key = "#accountId")
    @Transactional
    public void deleteAccountById(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID: " + accountId + " not found"));
        accountRepository.delete(account);
    }

    /**
     * Changes account role by admin (USER, MANAGER, or ADMIN).
     * Prevents self-role changes to maintain security.
     * 
     * @param accountId the account ID to update
     * @param accountRoleUpdateDTO new role data
     * @param caller the admin performing the change
     * @return UserSearchDTO with updated account
     * @throws com.uet.VolunteerHub.exception.SelfRoleChangeException if admin tries to change own role
     */
    @CacheEvict(value = "users", key = "#accountId")
    @Transactional
    public UserSearchDTO changeAccountRole(UUID accountId, AccountRoleUpdateDTO accountRoleUpdateDTO, Account caller) {
        Pair<Account, Profile> accountAndUserInfo = findAccountAndUserInfo(accountId);
        Account account = accountAndUserInfo.getFirst();
        if (caller == null) {
            throw new IllegalStateException("Caller account is null - authentication failed");
        }
        // Prevent admin from changing their own role
        if (caller.getAccountId() != null && caller.getAccountId().equals(accountId)) {
            throw new com.uet.VolunteerHub.exception.SelfRoleChangeException(
                "You cannot change your own account role. Please contact another admin.");
        }
        if (accountRoleUpdateDTO.getRole() != null) {
            account.setRole(accountRoleUpdateDTO.getRole());
        }
        accountRepository.save(account);
        return mapToUserSearchDTO(account, accountAndUserInfo.getSecond());
    }

    /**
     * Changes account status by admin (ACTIVE, INACTIVE, or BANNED).
     * Prevents self-ban to maintain admin access.
     * 
     * @param accountId the account ID to update
     * @param accountStatusUpdateDTO new status data
     * @param caller the admin performing the change
     * @return UserSearchDTO with updated account
     * @throws com.uet.VolunteerHub.exception.SelfRoleChangeException if admin tries to ban themselves
     */
    @CacheEvict(value = "users", key = "#accountId")
    @Transactional
    public UserSearchDTO changeAccountStatus(UUID accountId, AccountStatusUpdateDTO accountStatusUpdateDTO, Account caller) {
        Pair<Account, Profile> accountAndUserInfo = findAccountAndUserInfo(accountId);
        Account account = accountAndUserInfo.getFirst();
        if (caller == null) {
            throw new IllegalStateException("Caller account is null - authentication failed");
        }
        if (caller.getAccountId() != null && caller.getAccountId().equals(accountId) 
                && accountStatusUpdateDTO.getStatus() == AccountStatus.BANNED) {
            throw new com.uet.VolunteerHub.exception.SelfRoleChangeException(
                "You cannot ban your own account. Please contact another admin.");
        }
        if (accountStatusUpdateDTO.getStatus() != null) {
            account.setAccountStatus(accountStatusUpdateDTO.getStatus());
        }
        accountRepository.save(account);
        return mapToUserSearchDTO(account, accountAndUserInfo.getSecond());
    }

    /**
     * Creates a new account by admin with custom role and status.
     * Admin can create accounts with any role without email verification.
     * 
     * @param accountAdminCreateDTO account creation data with role and status
     * @return UserSearchDTO with created account details
     * @throws ResourceAlreadyExistsException if username/email already exists
     */
    @Transactional
    public UserSearchDTO createAccount(AccountAdminCreateDTO accountAdminCreateDTO) {
        // Explicit validation BEFORE save to prevent issues with delayed constraint violations
        if (accountRepository.existsByUsername(accountAdminCreateDTO.getUsername())) {
            throw new ResourceAlreadyExistsException("Username " + accountAdminCreateDTO.getUsername() + " is already in use");
        }
        if (accountRepository.existsByEmail(accountAdminCreateDTO.getEmail())) {
            throw new ResourceAlreadyExistsException("Email " + accountAdminCreateDTO.getEmail() + " is already in use");
        }
        
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
        Profile userInfo = new Profile();
        try {
            userInfo.setAccount(account);
            account.setUserInfo(userInfo);
            accountRepository.save(account);
        } catch (DataIntegrityViolationException e) {
            // Fallback for race conditions
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


    /**
     * Changes authenticated user's password after verifying old password.
     * Validates old password and confirms new password match.
     * 
     * @param account the authenticated account
     * @param accountPasswordChangeDTO password change data
     * @throws IllegalArgumentException if old password incorrect or passwords don't match
     */
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
        Profile userInfo = account.getUserInfo();
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
