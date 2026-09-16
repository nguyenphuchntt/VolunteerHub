package com.uet.VolunteerHub.dto.FCM;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FcmTokenDTO {
    @NotBlank(message = "FCM token cannot be blank")
    private String token;
}
