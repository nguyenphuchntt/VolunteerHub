package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Account.FollowUserDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Follow;
import com.uet.VolunteerHub.entity.FollowId;
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

    private FollowUserDTO mapToFollowUserDTO(Follow followUser) {
        FollowUserDTO dto = new FollowUserDTO();
        dto.setAccountId(followUser.getFollowing().getAccountId());
        dto.setFollowedByAccountId(followUser.getFollower().getAccountId());
        dto.setUsername(followUser.getFollowing().getUsername());
        dto.setFollowByUsername(followUser.getFollower().getUsername());
        if (followUser.getFollowing().getUserInfo() != null) {
            dto.setFullName(followUser.getFollowing().getUserInfo().getFirstName() + " " + followUser.getFollowing().getUserInfo().getLastName());
        }
        if (followUser.getFollower().getUserInfo() != null) {
            dto.setFollowByFullName(followUser.getFollower().getUserInfo().getFirstName() + " " + followUser.getFollower().getUserInfo().getLastName());
        }
        return dto;
    }

    public long countFollowersByAccountId(UUID accountId) {
        return followUserRepository.countByFollowing_AccountId(accountId);
    }

    public long countFollowingByAccountId(UUID followedByAccountId) {
        return followUserRepository.countByFollower_AccountId(followedByAccountId);
    }

    public Page<FollowUserDTO> getFollowersByAccountId(UUID accountId, Pageable pageable) {
        Page<Follow> followUsers = followUserRepository.findAllByFollowing_AccountId(accountId, pageable);
        return followUsers.map(this::mapToFollowUserDTO);
    }

    public Page<FollowUserDTO> getFollowingByAccountId(UUID followedByAccountId, Pageable pageable) {
        Page<Follow> followUsers = followUserRepository.findAllByFollower_AccountId(followedByAccountId, pageable);
        return followUsers.map(this::mapToFollowUserDTO);
    }

    @Transactional
    public FollowUserDTO followUser(Account account, UUID toBeFollowedAccountId) {
        Account toBeFollowedAccount = accountRepository.findById(toBeFollowedAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + toBeFollowedAccountId + "not found"));
        Account follower = accountRepository.findById(account.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + account.getAccountId() + "not found"));
        Follow followUser = new Follow();
        followUser.setFollowId(new FollowId(follower.getAccountId(), toBeFollowedAccount.getAccountId()));
        followUser.setFollower(follower);
        followUser.setFollowing(toBeFollowedAccount);
        Follow savedFollowUser = followUserRepository.save(followUser);
        return mapToFollowUserDTO(savedFollowUser);
    }

    @Transactional
    public void unfollowUser(Account account, UUID toBeUnfollowedAccountId) {
        Account toBeUnfollowedAccount = accountRepository.findById(toBeUnfollowedAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID" + toBeUnfollowedAccountId + "not found"));
        FollowId followUserId = new FollowId();
        followUserId.setFollowerId(account.getAccountId());
        followUserId.setFollowingId(toBeUnfollowedAccount.getAccountId());
        try {
            followUserRepository.deleteById(followUserId);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Follow relationship of " + account.getUsername() + " and account ID " + toBeUnfollowedAccount.getUsername() + " not found");
        }
    }

    public boolean isFollowing(UUID accountId, UUID toBeCheckedAccountId) {
        return followUserRepository.existsByFollower_AccountIdAndFollowing_AccountId(accountId, toBeCheckedAccountId);
    }

}
