package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCreateDTO {
    @NotBlank(message = "Notification content cannot be blank")
    @Size(max = 500, message = "Notification content must not exceed 500 characters")
    private String content;
}
