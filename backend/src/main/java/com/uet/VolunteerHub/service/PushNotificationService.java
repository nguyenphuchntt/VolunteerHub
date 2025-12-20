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
        List<FcmToken> fcmTokens = fcmTokenRepository.findAllByAccountId(accountId);
        List<String> response = new ArrayList<>();

        for (var token : fcmTokens) {
            Message message = Message.builder()
                    .putData("content", content)
                    .setToken(token.getToken())
                    .build();
            try {
                response.add(firebaseMessaging.send(message));
            } catch (Exception e) {
                log.error("Error sending push notification to token {}: {}", token.getToken(), e.getMessage());
            }
        }
    }

    @Async
    public void pushNotificationToMultipleUsers(List<UUID> accountIds, String content) {
        List<FcmToken> fcmTokens = fcmTokenRepository.findAllByAccountIdIn(accountIds);
        if (fcmTokens.isEmpty()) return;

        List<String> tokens = fcmTokens.stream()
                .map(FcmToken::getToken)
                .toList();

        List<List<String>> batches = chunkList(tokens, 500);

        for (List<String> batch : batches) {
            MulticastMessage message = MulticastMessage.builder()
                    .putData("content", content)
                    .addAllTokens(batch)
                    .build();
            try {
                BatchResponse response = firebaseMessaging.sendMulticast(message);
                if (response.getFailureCount() > 0) {
                    log.warn("FCM Batch failure: {} failures out of {}", response.getFailureCount(), batch.size());
                }
            } catch (Exception e) {
                log.error("Error sending push notification to multiple tokens: {}", e.getMessage());
            }
        }
    }

    @Transactional
    public void subscribeToken(UUID accountId, FcmTokenDTO fcmTokenDTO) {
        String token = fcmTokenDTO.getToken();
        Optional<FcmToken> existingToken = fcmTokenRepository.findByToken(token);
        if (existingToken.isPresent()) {
            FcmToken curr =  existingToken.get();
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
