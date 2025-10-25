package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

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

    @Transactional
    public Optional<UserDTO> getUserByUserName(String username) {
        Optional<Account> account = accountRepository.findByUsername(username);
        if (account.isPresent()) {
            UUID accountId = account.get().getAccountId();
            Optional<UserInfo> userInfo = userInfoRepository.findById(accountId);
            if (userInfo.isPresent()) {
                UserDTO userDTO = new UserDTO(
                        accountId,
                        account.get().getUsername(),
                        account.get().getEmail(),
                        userInfo.get().getFirstName(),
                        userInfo.get().getLastName(),
                        userInfo.get().getDateOfBirth(),
                        userInfo.get().getCountry(),
                        userInfo.get().getCity(),
                        userInfo.get().getAddress(),
                        userInfo.get().getOrganization()
                );
                return Optional.of(userDTO);
            } else {
                log.warning("Account not found for username " + username);
                return Optional.empty();
            }
        }
        log.warning("Account not found for username " + username);
        return Optional.empty();
    }

    @Transactional
    public Optional<UserDTO> getUserById(UUID accountId) {
        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            Optional<UserInfo> userInfo = userInfoRepository.findById(accountId);
            if (userInfo.isPresent()) {
                UserDTO userDTO = new UserDTO(
                        accountId,
                        account.get().getUsername(),
                        account.get().getEmail(),
                        userInfo.get().getFirstName(),
                        userInfo.get().getLastName(),
                        userInfo.get().getDateOfBirth(),
                        userInfo.get().getCountry(),
                        userInfo.get().getCity(),
                        userInfo.get().getAddress(),
                        userInfo.get().getOrganization()
                );
                return Optional.of(userDTO);
            } else {
                log.warning("UserInfo not found for accountId " + accountId);
                return Optional.empty();
            }
        }
        log.warning("Account not found for accountId " + accountId);
        return Optional.empty();
    }

}
