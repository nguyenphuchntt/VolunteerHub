package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED, force = true)
public class UserProfileUpdateDTO {

    @NotNull
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
