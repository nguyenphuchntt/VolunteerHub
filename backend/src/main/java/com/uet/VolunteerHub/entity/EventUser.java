package com.uet.VolunteerHub.entity;

import com.uet.VolunteerHub.enums.EventUserRole;
import com.uet.VolunteerHub.enums.EventUserStatus;
import com.uet.VolunteerHub.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@IdClass(EventUserId.class)
@Table(name = "event_user")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventUser {

    @Id
    @Column(name = "account_id", updatable = false, nullable = false)
    private UUID accountId;

    @Id
    @Column(name = "event_id", updatable = false, nullable = false)
    private Long eventId;

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private Instant registeredAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EventUserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_user_role", nullable = false)
    private EventUserRole role;

    @Column(name = "start_at")
    private Instant startAt;

    @Column(name = "end_at")
    private Instant endAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false, insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false, insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull
    private Event event;
}
