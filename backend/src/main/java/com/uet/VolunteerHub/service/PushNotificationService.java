package com.uet.VolunteerHub.service;

import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import com.uet.VolunteerHub.dto.FcmTokenDTO;
import com.uet.VolunteerHub.entity.FcmToken;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.FcmTokenRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class PushNotificationService {
    private final FirebaseMessaging firebaseMessaging;
    private final FcmTokenRepository fcmTokenRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public PushNotificationService(FirebaseMessaging firebaseMessaging,
            FcmTokenRepository fcmTokenRepository, AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
        this.fcmTokenRepository = fcmTokenRepository;
        this.firebaseMessaging = firebaseMessaging;
    }

    @Async
    public void pushNotificationToUser(UUID accountId, String content) {
        log.info("Attempting to send push notification to accountId: {}, content: {}", accountId, content);
        List<FcmToken> fcmTokens = fcmTokenRepository.findAllByAccountId(accountId);

        if (fcmTokens.isEmpty()) {
            log.warn("No FCM tokens found for accountId: {}", accountId);
            return;
        }

        log.info("Found {} FCM token(s) for accountId: {}", fcmTokens.size(), accountId);
        List<FcmToken> invalidTokens = new ArrayList<>();

        for (var token : fcmTokens) {
            Message message = Message.builder()
                    .putData("content", content)
                    .setToken(token.getToken())
                    .build();
            try {
                String result = firebaseMessaging.send(message);
                log.info("Successfully sent push notification, response: {}", result);
            } catch (Exception e) {
                String errorMessage = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
                log.error("Error sending push notification to token {}: {}", token.getToken(), e.getMessage());

                // Check if token is invalid and should be removed
                if (isInvalidTokenError(errorMessage)) {
                    log.warn("Invalid FCM token detected, marking for deletion: {}", token.getToken());
                    invalidTokens.add(token);
                }
            }
        }

        // Delete invalid tokens from database
        if (!invalidTokens.isEmpty()) {
            deleteInvalidTokens(invalidTokens);
        }
    }

    /**
     * Check if the error indicates an invalid/expired token
     */
    private boolean isInvalidTokenError(String errorMessage) {
        return errorMessage.contains("not-registered") ||
                errorMessage.contains("invalid-registration-token") ||
                errorMessage.contains("registration-token-not-registered") ||
                errorMessage.contains("unregistered") ||
                errorMessage.contains("invalid_token") ||
                errorMessage.contains("404");
    }

    /**
     * Delete invalid tokens from database
     */
    @Transactional
    public void deleteInvalidTokens(List<FcmToken> tokens) {
        log.info("Deleting {} invalid FCM token(s)", tokens.size());
        for (FcmToken token : tokens) {
            try {
                fcmTokenRepository.delete(token);
                log.info("Deleted invalid FCM token: {}", token.getToken().substring(0, 20) + "...");
            } catch (Exception e) {
                log.error("Failed to delete invalid token: {}", e.getMessage());
            }
        }
    }

    @Async
    public void pushNotificationToMultipleUsers(List<UUID> accountIds, String content) {
        List<FcmToken> fcmTokens = fcmTokenRepository.findAllByAccountIdIn(accountIds);
        if (fcmTokens.isEmpty())
            return;

        List<FcmToken> invalidTokens = new ArrayList<>();
        List<List<FcmToken>> tokenBatches = chunkList(fcmTokens, 500);

        for (List<FcmToken> batch : tokenBatches) {
            List<String> tokenStrings = batch.stream()
                    .map(FcmToken::getToken)
                    .toList();

            MulticastMessage message = MulticastMessage.builder()
                    .putData("content", content)
                    .addAllTokens(tokenStrings)
                    .build();
            try {
                BatchResponse response = firebaseMessaging.sendMulticast(message);
                if (response.getFailureCount() > 0) {
                    log.warn("FCM Batch failure: {} failures out of {}", response.getFailureCount(), batch.size());

                    // Identify and collect invalid tokens
                    var responses = response.getResponses();
                    for (int i = 0; i < responses.size(); i++) {
                        var sendResponse = responses.get(i);
                        if (!sendResponse.isSuccessful() && sendResponse.getException() != null) {
                            String errorMessage = sendResponse.getException().getMessage();
                            if (errorMessage != null && isInvalidTokenError(errorMessage.toLowerCase())) {
                                log.warn("Invalid token found in batch: {}",
                                        batch.get(i).getToken().substring(0, 20) + "...");
                                invalidTokens.add(batch.get(i));
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error sending push notification to multiple tokens: {}", e.getMessage());
            }
        }

        // Delete all invalid tokens found
        if (!invalidTokens.isEmpty()) {
            deleteInvalidTokens(invalidTokens);
        }
    }

    @Transactional
    public void subscribeToken(UUID accountId, FcmTokenDTO fcmTokenDTO) {
        String token = fcmTokenDTO.getToken();
        Optional<FcmToken> existingToken = fcmTokenRepository.findByToken(token);
        if (existingToken.isPresent()) {
            FcmToken curr = existingToken.get();
            if (!curr.getAccountId().equals(accountId)) {
                curr.setAccountId(accountId);
                fcmTokenRepository.save(curr);
            }
        } else {
            FcmToken fcmToken = new FcmToken();
            fcmToken.setToken(fcmTokenDTO.getToken());
            fcmToken.setAccountId(accountId);
            fcmTokenRepository.save(fcmToken);
        }
    }

    @Transactional
    public void unsubscribeToken(FcmTokenDTO fcmTokenDTO) {
        String token = fcmTokenDTO.getToken();
        fcmTokenRepository.findByToken(token).ifPresent(fcmTokenRepository::delete);
    }

    @Transactional
    public void unsubscribeAllTokens(UUID accountId) {
        List<FcmToken> fcmTokens = fcmTokenRepository.findAllByAccountId(accountId);
        fcmTokenRepository.deleteAll(fcmTokens);
    }

    private <T> List<List<T>> chunkList(List<T> list, int batchSize) {
        List<List<T>> batches = new ArrayList<>();
        for (int i = 0; i < list.size(); i += batchSize) {
            batches.add(list.subList(i, Math.min(i + batchSize, list.size())));
        }
        return batches;
    }

}
