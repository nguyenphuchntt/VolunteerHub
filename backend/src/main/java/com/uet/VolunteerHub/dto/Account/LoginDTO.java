package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginDTO {
    @NotNull
    @Size(min = 1, message = "This field must not be empty")
    private String usernameOrEmail;

    @NotNull
    @Size(min = 1, message = "This field must not be empty")
    private String password;
}
