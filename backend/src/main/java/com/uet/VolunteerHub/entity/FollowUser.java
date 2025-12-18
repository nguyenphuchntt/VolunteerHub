package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "follow_user")
@Data
@IdClass(FollowUserId.class)
@AllArgsConstructor
@NoArgsConstructor
public class FollowUser {
    @Id
    @Column(name = "account_id", nullable = false, updatable = false)
    private UUID accountId;

    @Id
    @Column(name = "followed_by_account_id", nullable = false, updatable = false)
    private UUID followedByAccountId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false, insertable = false, updatable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "followed_by_account_id", nullable = false, insertable = false, updatable = false)
    private Account followedByAccount;
}
