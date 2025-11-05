package com.uet.VolunteerHub.dto.EventUser;

import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.Data;

@Data
public class EventUserStatusUpdateDTO {
    private EventUserStatus status;
}
