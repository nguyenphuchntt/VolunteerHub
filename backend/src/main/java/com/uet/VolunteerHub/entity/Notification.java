package com.uet.VolunteerHub.entity;

import com.uet.VolunteerHub.enums.NotificationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "notificationId")
@Table(name = "notification")
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "notification_id", nullable = false, updatable = false)
    private Long notificationId;

    @OneToOne
    @NotNull
    @JoinColumn(name = "sender_account_id")
    private Account senderAccount;

    @OneToOne
    @NotNull
    @JoinColumn(name = "receiver_account_id")
    private Account receiverAccount;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", columnDefinition = "notification_type", nullable = false)
    private NotificationType notificationType;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @CreationTimestamp
    @Column(name = "create_at", nullable = false, updatable = false)
    private OffsetDateTime createAt;
}
