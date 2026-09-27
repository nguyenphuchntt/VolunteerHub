package com.uet.VolunteerHub.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uet.VolunteerHub.entity.Notification;
import com.uet.VolunteerHub.enums.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    long countByReceiverAccount_AccountIdAndIsReadFalseAndIsDeletedFalse(UUID receiverId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true " +
            "WHERE n.receiverAccount.accountId = :receiverId AND n.isRead = false AND n.isDeleted = false")
    void markAllAsReadByReceiverId(@Param("receiverId") UUID receiverId);

    List<Notification> findAllByReceiverAccount_AccountIdOrNotificationTypeAndIsDeletedFalse(UUID receiverId, NotificationType type);

    @Query(value = "SELECT n FROM Notification n " +
            "LEFT JOIN n.senderAccount " +
            "WHERE (n.receiverAccount.accountId = :receiverId OR n.notificationType = com.uet.VolunteerHub.enums.NotificationType.SYSTEM_ANNOUNCEMENT) " +
            "AND n.isDeleted = false",
            countQuery = "SELECT COUNT(n) FROM Notification n " +
                    "WHERE (n.receiverAccount.accountId = :receiverId OR n.notificationType = com.uet.VolunteerHub.enums.NotificationType.SYSTEM_ANNOUNCEMENT) " +
                    "AND n.isDeleted = false")
    Page<Notification> findAllForUserOrSystemAnnouncementPaged(
            @Param("receiverId") UUID receiverId,
            Pageable pageable);

    @Query("SELECT n FROM Notification n " +
            "JOIN FETCH n.senderAccount sa " +
            "WHERE n.receiverAccount.accountId = :managerId " +
            "AND n.notificationType IN :types " +
            "AND n.isDeleted = false " +
            "ORDER BY n.createdAt DESC")
    Page<Notification> findManagerEventNotifications(
            @Param("managerId") UUID managerId,
            @Param("types") List<NotificationType> types,
            Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n " +
            "WHERE n.receiverAccount.accountId = :managerId " +
            "AND n.notificationType IN :types " +
            "AND n.isRead = false " +
            "AND n.isDeleted = false")
    long countUnreadManagerEventNotifications(
            @Param("managerId") UUID managerId,
            @Param("types") List<NotificationType> types);

    @Query("SELECT n FROM Notification n " +
            "JOIN FETCH n.senderAccount sa " +
            "WHERE n.receiverAccount.accountId = :userId " +
            "AND n.notificationType IN :types " +
            "AND n.isDeleted = false " +
            "ORDER BY n.createdAt DESC")
    Page<Notification> findUserRoleRequestNotifications(
            @Param("userId") UUID userId,
            @Param("types") List<NotificationType> types,
            Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n " +
            "WHERE n.receiverAccount.accountId = :userId " +
            "AND n.notificationType IN :types " +
            "AND n.isRead = false " +
            "AND n.isDeleted = false")
    long countUnreadUserRoleRequestNotifications(
            @Param("userId") UUID userId,
            @Param("types") List<NotificationType> types);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true " +
            "WHERE n.receiverAccount.accountId = :receiverId " +
            "AND n.notificationType IN :types " +
            "AND n.isRead = false " +
            "AND n.isDeleted = false")
    void markAsReadByReceiverIdAndTypes(
            @Param("receiverId") UUID receiverId,
            @Param("types") List<NotificationType> types);
}

