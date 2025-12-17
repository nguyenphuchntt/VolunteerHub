package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    long countByReceiverAccount_AccountIdAndIsReadFalseAndIsDeletedFalse(UUID receiverId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true " +
            "WHERE n.receiverAccount.accountId = :receiverId AND n.isRead = false AND n.isDeleted = false")
    void markAllAsReadByReceiverId(@Param("receiverId") UUID receiverId);
}
