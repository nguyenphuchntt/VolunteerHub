package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED, force = true)
@Setter
@Getter
public class UserDTO {
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

    private OffsetDateTime createdAt;

}
