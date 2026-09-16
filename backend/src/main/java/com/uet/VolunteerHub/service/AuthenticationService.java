package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.ApplicationEvent.AccountRegisteredEvent;
import com.uet.VolunteerHub.dto.Account.AccountUserRegisterDTO;
import com.uet.VolunteerHub.dto.Account.LoginDTO;
import com.uet.VolunteerHub.dto.Account.RegisterResponse;
import com.uet.VolunteerHub.dto.Account.UserSearchDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Profile;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.exception.AccountBannedException;
import com.uet.VolunteerHub.exception.AccountNotActivatedException;
import com.uet.VolunteerHub.exception.ResourceAlreadyExistsException;
import com.uet.VolunteerHub.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final ApplicationEventPublisher eventPublisher;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService,
            ApplicationEventPublisher eventPublisher) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public RegisterResponse register(AccountUserRegisterDTO request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password does not match");
        }
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username " + request.getUsername() + " is already in use");
        }
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email " + request.getEmail() + " is already in use");
        }
        Account newAccount = Account.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountStatus(AccountStatus.INACTIVE)
                .role(UserRole.USER)
                .updatedAt(Instant.now())
                .build();
        Profile userProfile = Profile.builder().build();
        try {
            userProfile.setAccount(newAccount);
            newAccount.setUserInfo(userProfile);
            newAccount = accountRepository.save(newAccount);
        } catch (DataIntegrityViolationException e) {
            // Fallback for race conditions - in case another request creates the same account
            // between our check and save
            String error = e.getMessage();
            if (error.contains("uk_account_email")) {
                throw new ResourceAlreadyExistsException("Email " + request.getEmail() + " is already in use");
            }
            if (error.contains("uk_account_username")) {
                throw new ResourceAlreadyExistsException("Username " + request.getUsername() + " is already in use");
            } else throw new RuntimeException("Error: " + error);
        }
        eventPublisher.publishEvent(
                AccountRegisteredEvent.builder()
                        .accountId(newAccount.getAccountId())
                        .username(newAccount.getUsername())
                        .email(newAccount.getEmail())
                        .createdAt(newAccount.getCreatedAt())
                        .build()
        );
        return RegisterResponse.builder()
                .accountID(newAccount.getAccountId())
                .username(newAccount.getUsername())
                .email(newAccount.getEmail())
                .accountStatus(newAccount.getAccountStatus())
                .createdAt(newAccount.getCreatedAt())
                .build();
    }

    public RefreshTokenService.IssuedTokens login(LoginDTO loginDTO) {
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
        return refreshTokenService.issue(account);
    }
}
