package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountUserRegisterDTO {
    @NotBlank(message = "Please enter your username")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Please enter your password")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Please confirm your password")
    private String confirmPassword;

    @NotNull
    @Email
    private String email;
}
