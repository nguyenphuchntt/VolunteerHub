package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED, force=true)
@Table(name="account_media")
@IdClass(AccountMediaId.class)
public class AccountMedia {
    @Id
    @Column(name="account_id", nullable = false, updatable = false)
    private UUID accountId;

    @Id
    @Column(name="media_id", nullable = false, updatable = false)
    private UUID mediaId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false, insertable = false, updatable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id", nullable = false, insertable = false, updatable = false)
    private Media media;
}
