package com.uet.VolunteerHub.dto.Account;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountPasswordDTO {
    @NotBlank(message = "Please enter your password")
    private String password;
}
