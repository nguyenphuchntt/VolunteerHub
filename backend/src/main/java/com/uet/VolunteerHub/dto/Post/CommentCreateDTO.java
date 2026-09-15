package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentCreateDTO {

    @NotBlank(message = "Content cannot be blank")
    @Size(min = 1, max = 200, message = "Comment must be between 1 and 200 characters")
    private String content;

    @NotNull(message = "PostId cannot be null")
    private Long postId;

    @NotNull(message = "createdByAccountId cannot be null")
    private UUID createdByAccountId;

    private Long parentCommentId;
}