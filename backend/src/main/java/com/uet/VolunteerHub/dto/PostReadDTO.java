package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostType;
import lombok.*;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostReadDTO {
    private Long postId;
    private String content;
    private OffsetDateTime createAt;
    private PostType postType;
    private String eventTitle;
    private String ownerUsername;
    private String ownerFirstName;
    private String ownerLastName;
}


