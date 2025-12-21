package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountAdminPasswordChangeDTO {
    @NotNull
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    @NotBlank(message = "Please confirm new password")
    private String confirmPassword;
}
