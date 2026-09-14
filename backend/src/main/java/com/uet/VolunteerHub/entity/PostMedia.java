package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(PostMediaId.class)
@Table(name = "post_media")
public class PostMedia {

    @Id
    @Column(name = "media_id", nullable = false, updatable = false)
    private UUID mediaId;

    @Id
    @Column(name = "post_id", nullable = false, updatable = false)
    private Long postId;

    @Column(name = "position", nullable = false)
    private Integer position = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id", nullable = false, insertable = false, updatable = false)
    private Media media;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "post_id", nullable = false, insertable = false, updatable = false)
    private Post post;
}
