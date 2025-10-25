package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.entity.UserInfo;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final AccountRepository accountRepository;
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public UserService(AccountRepository accountRepository, UserInfoRepository userInfoRepository) {
        this.accountRepository = accountRepository;
        this.userInfoRepository = userInfoRepository;
    }


}
