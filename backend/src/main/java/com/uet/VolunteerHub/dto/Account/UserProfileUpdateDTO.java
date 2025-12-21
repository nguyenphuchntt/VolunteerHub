package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED, force = true)
public class UserProfileUpdateDTO {

    @Email(message = "Please enter a valid email address")
    private String email;

    @Size(min = 2, max = 30, message = "First name must be between 2 and 30 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ỹ\\s]*$", message = "First name can only contain letters")
    private String firstName;

    @Size(min = 2, max = 30, message = "Last name must be between 2 and 30 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ỹ\\s]*$", message = "Last name can only contain letters")
    private String lastName;

    @Past(message = "Date of birth must be in the past")
    private Date dateOfBirth;

    @Size(max = 20, message = "Country must not exceed 20 characters")
    private String country;

    @Size(max = 20, message = "City must not exceed 20 characters")
    private String city;

    @Size(max = 20, message = "Address must not exceed 20 characters")
    private String address;

    @Size(max = 20, message = "Organization must not exceed 20 characters")
    private String organization;
}
