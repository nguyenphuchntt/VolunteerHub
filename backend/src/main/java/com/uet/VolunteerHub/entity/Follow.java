package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "follow")
@Data
@NoArgsConstructor
public class Follow {

    @EmbeddedId
    private FollowId followId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("followerId")
    @JoinColumn(name = "follower_id", nullable = false)
    private Account follower;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("followingId")
    @JoinColumn(name = "following_id", nullable = false)
    private Account following;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}
