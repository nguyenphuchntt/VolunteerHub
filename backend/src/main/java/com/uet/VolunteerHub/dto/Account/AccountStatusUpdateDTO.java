package com.uet.VolunteerHub.dto.Account;

import com.uet.VolunteerHub.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountStatusUpdateDTO {
    @NotNull
    private AccountStatus status;
}
