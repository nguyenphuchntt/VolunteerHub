package com.uet.VolunteerHub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class LikeID implements Serializable {

    @Column(name = "post_id", nullable = false, updatable = false)
    private Long postId;

    @Column(name = "account_id", nullable = false, updatable = false)
    private UUID accountId;
}
