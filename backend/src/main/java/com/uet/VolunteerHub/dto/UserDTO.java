package com.uet.VolunteerHub.dto;

import lombok.*;

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

    private String firstName;

    private String lastName;

    private Date dateOfBirth;

    private String country;

    private String city;

    private String address;

    private String organization;

}
