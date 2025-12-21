package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventUserStatusUpdateDTO {
    @NotNull(message = "Status cannot be null")
    private EventUserStatus status;
}
