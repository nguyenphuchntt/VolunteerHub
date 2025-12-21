package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED, force = true)
@Entity
@Table(name = "event_media")
@IdClass(EventMediaId.class)
@Getter
@Setter
public class EventMedia {
    @Id
    @Column(name = "event_id", nullable = false, updatable = false)
    private Long eventId;

    @Id
    @Column(name = "media_id", nullable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID mediaId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false, insertable = false, updatable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "media_id", nullable = false, insertable = false, updatable = false)
    private Media media;
}
