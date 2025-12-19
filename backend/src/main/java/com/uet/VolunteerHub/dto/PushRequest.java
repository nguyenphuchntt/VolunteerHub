package com.uet.VolunteerHub.dto;

import lombok.Data;

@Data
public class PushRequest {
    private String fcmToken;
    private String content;
}
