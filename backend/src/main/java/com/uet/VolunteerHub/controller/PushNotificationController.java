package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.PushRequest;
import com.uet.VolunteerHub.service.PushNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push-notifications")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    @Autowired
    public PushNotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendPushNotification(@RequestBody PushRequest request) {
        String response = pushNotificationService.pushNotification(request);
        return ResponseEntity.ok(response);
    }
}
