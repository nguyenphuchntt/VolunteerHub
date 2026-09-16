package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Account.LoginDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.exception.AccountBannedException;
import com.uet.VolunteerHub.exception.AccountNotActivatedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private AuthenticationManager authenticationManager;

    public AuthenticationService(
            AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public boolean login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        loginDTO.getUsernameOrEmail(), loginDTO.getPassword()));
        Account account = (Account) authentication.getPrincipal();
        if (account.getAccountStatus() == AccountStatus.BANNED) {
            throw new AccountBannedException("Your account has been banned by admin");
        }
        if (account.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new AccountNotActivatedException("You must activate your account first");
        }
        return true;
    }
}
