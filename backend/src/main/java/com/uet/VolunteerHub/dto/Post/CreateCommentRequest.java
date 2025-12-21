package com.uet.VolunteerHub.dto.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {
    @NotBlank(message = "Content cannot be blank")
    @Size(min = 1, max = 200, message = "Comment must be between 1 and 200 characters")
    private String content;

    @NotNull(message = "Post ID cannot be null")
    private Long postId;

    private Long parentCommentId;
}
