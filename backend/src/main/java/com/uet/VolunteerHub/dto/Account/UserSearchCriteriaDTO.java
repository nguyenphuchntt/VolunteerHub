package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.UUID;

@Data
public class UserSearchCriteriaDTO {
    private UUID userId;
    private String username;
    private String email;
    private AccountStatus accountStatus;
    private UserRole role;
    private String country;
    private String city;
    private String organization;
    private String firstName;
    private String lastName;
    private Date dateOfBirthFrom;
    private Date dateOfBirthTo;
    private OffsetDateTime createAtFrom;
    private OffsetDateTime createAtTo;
}
