package com.uet.VolunteerHub.repository.specification;

import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.enums.NotificationType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component // Quan trọng: Để Spring có thể inject (tiêm)
public class NotificationSpecification {

    public Specification<Notification> hasId(Long notificationId) {
        return (root, query, cb) ->
                notificationId == null ? null : cb.equal(root.get("notificationId"), notificationId);
    }

    public Specification<Notification> hasSenderId(UUID senderAccountId) {
        return (root, query, cb) ->
                senderAccountId == null ? null : cb.equal(root.get("senderAccount").get("accountId"), senderAccountId);
    }

    public Specification<Notification> hasReceiverId(UUID receiverAccountId) {
        return (root, query, cb) ->
                receiverAccountId == null ? null : cb.equal(root.get("receiverAccount").get("accountId"), receiverAccountId);
    }

    public Specification<Notification> hasType(NotificationType type) {
        return (root, query, cb) ->
                type == null ? null : cb.equal(root.get("notificationType"), type);
    }

    public Specification<Notification> isRead(Boolean isRead) {
        return (root, query, cb) ->
                isRead == null ? null : cb.equal(root.get("isRead"), isRead);
    }

    public Specification<Notification> isDeleted(Boolean isDeleted) {
        return (root, query, cb) ->
                isDeleted == null ? null : cb.equal(root.get("isDeleted"), isDeleted);
    }
}