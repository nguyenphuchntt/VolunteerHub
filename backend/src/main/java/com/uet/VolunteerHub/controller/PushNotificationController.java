package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.FcmTokenDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.PushNotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/push-notifications")
@PreAuthorize("isAuthenticated()")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    @Autowired
    public PushNotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToPushNotifications(@RequestBody @Valid FcmTokenDTO request,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.subscribeToken(account.getAccountId(), request);
        return ResponseEntity.ok("Subscribed to push notifications successfully.");
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribeFromPushNotifications(@RequestBody @Valid FcmTokenDTO request,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.unsubscribeToken(request);
        return ResponseEntity.ok("Unsubscribed from push notifications successfully.");
    }

    @DeleteMapping("/unsubscribe-all")
    public ResponseEntity<String> unsubscribeFromAllPushNotifications(@AuthenticationPrincipal Account account) {
        pushNotificationService.unsubscribeAllTokens(account.getAccountId());
        return ResponseEntity.ok("Unsubscribed from all push notifications successfully.");
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendPushNotification(@RequestParam String content,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.pushNotificationToUser(account.getAccountId(), content);
        return ResponseEntity.ok("Push notification sent to user " + account.getAccountId() + "successfully.");
    }
}
