package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostStatus;
import com.uet.VolunteerHub.enums.PostVisibility;
import lombok.*;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostReadDTO {
    private Long postId;
    private String content;
    private Instant createAt;
    private PostVisibility postType;
    private PostStatus postStatus;
    private String eventTitle;
    private String ownerUsername;
    private String ownerFirstName;
    private String ownerLastName;
}


