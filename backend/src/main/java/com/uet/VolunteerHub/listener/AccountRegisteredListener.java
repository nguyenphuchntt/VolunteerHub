package com.uet.VolunteerHub.listener;

import com.uet.VolunteerHub.ApplicationEvent.AccountRegisteredEvent;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.service.OtpVerificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Optional;

@Slf4j
@Component
public class AccountRegisteredListener {

    private final AccountRepository accountRepository;
    private final OtpVerificationService otpVerificationService;

    public AccountRegisteredListener(
            AccountRepository accountRepository,
            OtpVerificationService otpVerificationService) {
        this.accountRepository = accountRepository;
        this.otpVerificationService = otpVerificationService;
    }

    @Async
    @TransactionalEventListener
    public void handleAccountRegisteredEvent(AccountRegisteredEvent event) {
        Optional<Account> account = accountRepository.findById(event.getAccountId());
        if (account.isEmpty()) {
            log.warn("Account {} disappeared before the verification OTP could be sent", event.getAccountId());
            return;
        }
        otpVerificationService.sendVerificationOtp(account.get());
    }
}
