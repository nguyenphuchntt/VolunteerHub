package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import lombok.*;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
public class UserSearchDTO {
    private UUID accountID;

    private String username;

    private String email;

    private AccountStatus status;

    private UserRole role;

    private String firstName;

    private String lastName;

    private Date dateOfBirth;

    private String country;

    private String city;

    private String address;

    private String organization;

    private Instant createdAt;

}
