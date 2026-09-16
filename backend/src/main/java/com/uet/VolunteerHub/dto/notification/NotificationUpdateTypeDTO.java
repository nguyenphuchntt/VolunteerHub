package com.uet.VolunteerHub.dto.notification;

import com.uet.VolunteerHub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationUpdateTypeDTO {
    private NotificationType type;
}
