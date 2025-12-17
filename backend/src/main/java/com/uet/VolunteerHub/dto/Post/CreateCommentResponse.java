package com.uet.VolunteerHub.dto.Post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentResponse {
    private Long id;
    private String content;
    private java.time.OffsetDateTime createdAt;
    private String createdBy;
}
