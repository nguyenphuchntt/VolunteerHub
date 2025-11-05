package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountRoleUpdateDTO {
    @NotNull
    private UserRole role;
}
