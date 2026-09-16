package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.AccountStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RegisterResponse {
    private UUID accountID;
    private String username;
    private String email;
    private AccountStatus accountStatus;
    private Instant createdAt;
}
