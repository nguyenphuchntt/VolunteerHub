package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostMediaId implements Serializable {
    private UUID mediaId;
    private Long postId;
}
