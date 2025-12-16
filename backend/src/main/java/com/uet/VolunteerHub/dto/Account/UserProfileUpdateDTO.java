package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED, force = true)
public class UserProfileUpdateDTO {

    @Email
    private String email;

    private String firstName;

    private String lastName;

    private Date dateOfBirth;

    private String country;

    private String city;

    private String address;

    private String organization;
}
