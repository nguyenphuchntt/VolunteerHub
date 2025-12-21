package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.FollowUserDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.FollowUser;
import com.uet.VolunteerHub.entity.FollowUserId;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.uet.VolunteerHub.repository.FollowUserRepository;

import java.util.UUID;

@Service
public class FollowUserService {
    private final FollowUserRepository followUserRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public FollowUserService(FollowUserRepository followUserRepository, AccountRepository accountRepository) {
        this.followUserRepository = followUserRepository;
        this.accountRepository = accountRepository;
    }

    private FollowUserDTO mapToFollowUserDTO(FollowUser followUser) {
        FollowUserDTO dto = new FollowUserDTO();
        dto.setAccountId(followUser.getAccount().getAccountId());
        dto.setFollowedByAccountId(followUser.getFollowedByAccount().getAccountId());
        dto.setUsername(followUser.getAccount().getUsername());
        dto.setFollowByUsername(followUser.getFollowedByAccount().getUsername());
        if (followUser.getAccount().getUserInfo() != null) {
            dto.setFullName(followUser.getAccount().getUserInfo().getFirstName() + " " + followUser.getAccount().getUserInfo().getLastName());
        }
        if (followUser.getFollowedByAccount().getUserInfo() != null) {
            dto.setFollowByFullName(followUser.getFollowedByAccount().getUserInfo().getFirstName() + " " + followUser.getFollowedByAccount().getUserInfo().getLastName());
        }
        return dto;
    }

    public long countFollowersByAccountId(UUID accountId) {
        return followUserRepository.countByAccount_AccountId(accountId);
    }

    public long countFollowingByAccountId(UUID followedByAccountId) {
        return followUserRepository.countByFollowedByAccount_AccountId(followedByAccountId);
    }

    public Page<FollowUserDTO> getFollowersByAccountId(UUID accountId, Pageable pageable) {
        Page<FollowUser> followUsers = followUserRepository.findAllByAccount_AccountId(accountId, pageable);
        return followUsers.map(this::mapToFollowUserDTO);
    }

    public Page<FollowUserDTO> getFollowingByAccountId(UUID followedByAccountId, Pageable pageable) {
        Page<FollowUser> followUsers = followUserRepository.findAllByFollowedByAccount_AccountId(followedByAccountId, pageable);
        return followUsers.map(this::mapToFollowUserDTO);
    }

    @Transactional
    public FollowUserDTO followUser(Account account, UUID toBeFollowedAccountId) {
        Account toBeFollowedAccount = accountRepository.findById(toBeFollowedAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + toBeFollowedAccountId + "not found"));
        Account followingAccount = accountRepository.findById(account.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + account.getAccountId() + "not found"));
        FollowUser followUser = new FollowUser();
        followUser.setAccount(toBeFollowedAccount);
        followUser.setAccountId(toBeFollowedAccount.getAccountId());
        followUser.setFollowedByAccountId(account.getAccountId());
        followUser.setFollowedByAccount(followingAccount);
        FollowUser savedFollowUser = followUserRepository.save(followUser);
        return mapToFollowUserDTO(savedFollowUser);
    }

    @Transactional
    public void unfollowUser(Account account, UUID toBeUnfollowedAccountId) {
        Account toBeUnfollowedAccount = accountRepository.findById(toBeUnfollowedAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + toBeUnfollowedAccountId + "not found"));
        FollowUserId followUserId = new FollowUserId();
        followUserId.setAccountId(toBeUnfollowedAccount.getAccountId());
        followUserId.setFollowedByAccountId(account.getAccountId());
        try {
            followUserRepository.deleteById(followUserId);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Follow relationship of " + account.getUsername() + " and account ID " + toBeUnfollowedAccount.getUsername() + " not found");
        }
    }

    public boolean isFollowing(UUID accountId, UUID toBeCheckedAccountId) {
        return followUserRepository.existsByAccount_AccountIdAndFollowedByAccount_AccountId(toBeCheckedAccountId, accountId);
    }

}
