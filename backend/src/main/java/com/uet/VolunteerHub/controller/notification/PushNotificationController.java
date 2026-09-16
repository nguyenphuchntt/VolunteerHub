package com.uet.VolunteerHub.controller.notification;

import com.uet.VolunteerHub.dto.FCM.FcmTokenDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.PushNotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for push notification management
 */
@RestController
@RequestMapping("/api/push-notifications")
@PreAuthorize("isAuthenticated()")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    @Autowired
    public PushNotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    /**
     * Subscribe to push notifications
     * @param request FCM token
     * @param account authenticated account
     * @return success message
     */
    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToPushNotifications(@RequestBody @Valid FcmTokenDTO request,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.subscribeToken(account.getAccountId(), request);
        return ResponseEntity.ok("Subscribed to push notifications successfully.");
    }

    /**
     * Unsubscribe from push notifications
     * @param request FCM token
     * @param account authenticated account
     * @return success message
     */
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribeFromPushNotifications(@RequestBody @Valid FcmTokenDTO request,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.unsubscribeToken(request);
        return ResponseEntity.ok("Unsubscribed from push notifications successfully.");
    }

    /**
     * Unsubscribe from all push notifications
     * @param account authenticated account
     * @return success message
     */
    @DeleteMapping("/unsubscribe-all")
    public ResponseEntity<String> unsubscribeFromAllPushNotifications(@AuthenticationPrincipal Account account) {
        pushNotificationService.unsubscribeAllTokens(account.getAccountId());
        return ResponseEntity.ok("Unsubscribed from all push notifications successfully.");
    }

    /**
     * Send push notification to user
     * @param content notification content
     * @param account authenticated account
     * @return success message
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendPushNotification(@RequestParam String content,
            @AuthenticationPrincipal Account account) {
        pushNotificationService.pushNotificationToUser(account.getAccountId(), content);
        return ResponseEntity.ok("Push notification sent to user " + account.getAccountId() + "successfully.");
    }
}
