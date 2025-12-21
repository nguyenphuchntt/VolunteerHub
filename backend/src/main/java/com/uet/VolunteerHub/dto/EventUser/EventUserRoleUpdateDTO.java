package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventUserRoleUpdateDTO {
    @NotNull(message = "Role cannot be null")
    private EventUserRole eventUserRole;
}
