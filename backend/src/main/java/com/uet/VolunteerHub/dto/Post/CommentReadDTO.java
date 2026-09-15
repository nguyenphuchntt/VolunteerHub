package com.uet.VolunteerHub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentReadDTO {
    private Long commentId;
    private String content;
    private Instant createdAt;

    private Long parentCommentId;

    private Long postId;

    private String ownerUsername;
    private String ownerFirstName;
    private String ownerLastName;
    
    private Long replyCount; // Number of replies to this comment
}
