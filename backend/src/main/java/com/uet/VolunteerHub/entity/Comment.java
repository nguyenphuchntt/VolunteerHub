package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "comment_id", updatable = false, nullable = false)
    private Long commentId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_account_id")
    private Account createdByAccount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @CreationTimestamp
    @Column(name = "create_at", nullable = false, updatable = false)
    private OffsetDateTime createAt;

    @NotNull
    @Column(name = "content", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @Size(min = 1, max = 300, message = "Comment's length should between 1 and 300 characters")
    @JoinColumn(name = "reply_to")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment")
    private Set<Comment> replies;
}
