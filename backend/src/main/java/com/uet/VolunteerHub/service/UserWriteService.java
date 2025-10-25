package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.UserSearchDTO;
import com.uet.VolunteerHub.dto.UserProfileUpdateDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

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
        return new UserSearchDTO(
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
    public UserSearchDTO updateUser(UUID userID, UserProfileUpdateDTO userProfileUpdateDTO) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> new EntityNotFoundException("Account with ID " + userID + " not found"));
        UserInfo userInfo = account.getUserInfo();
        account.setEmail(userProfileUpdateDTO.getEmail());
        userInfo.setFirstName(userProfileUpdateDTO.getFirstName());
        userInfo.setLastName(userProfileUpdateDTO.getLastName());
        userInfo.setCountry(userProfileUpdateDTO.getCountry());
        userInfo.setCity(userProfileUpdateDTO.getCity());
        userInfo.setAddress(userProfileUpdateDTO.getAddress());
        userInfo.setDateOfBirth(userProfileUpdateDTO.getDateOfBirth());
        userInfo.setOrganization(userProfileUpdateDTO.getOrganization());
        accountRepository.save(account);
        userInfoRepository.save(userInfo);
        return mapToUserDTO(account, userInfo);
    }

    @Transactional
    public UserSearchDTO deleteUser(UUID userID) {
        Account account = accountRepository.findById(userID).orElseThrow(
                () -> new EntityNotFoundException("Account with ID " + userID + " not found")
        );
        UserInfo userInfo = account.getUserInfo();
        accountRepository.delete(account);
        return mapToUserDTO(account, userInfo);
    }


}
