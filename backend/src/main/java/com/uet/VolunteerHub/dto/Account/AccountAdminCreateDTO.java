package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountAdminCreateDTO {

    @NotBlank(message = "Please enter the username")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Please enter the password")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Please confirm the password")
    private String confirmPassword;

    private AccountStatus accountStatus;

    private UserRole role;

    @NotBlank(message = "Please enter the email")
    @Email
    private String email;
}
