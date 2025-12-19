package com.uet.VolunteerHub.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.uet.VolunteerHub.dto.PushRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationService {
    private final FirebaseMessaging firebaseMessaging;

    @Autowired
    public PushNotificationService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    public String pushNotification(PushRequest request) {
        Message message = Message.builder()
                .putData("content", request.getContent())
                .setToken(request.getFcmToken())
                .build();
        String response = null;
        try {
            response = firebaseMessaging.send(message);
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
