package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name="event_like")
@AllArgsConstructor
@NoArgsConstructor
@IdClass(EventLikeId.class)
@EqualsAndHashCode(of={"accountId", "eventId"})
@ToString(exclude ={"account", "event"})
public class EventLike {

    @Id
    @Column(name = "account_id", updatable = false, nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID accountId;

    @Id
    @Column(name = "event_id", updatable = false, nullable = false)
    private Long eventId;

    @CreationTimestamp
    @Column(name = "create_at", updatable = false, nullable = false)
    private OffsetDateTime createAt;

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
