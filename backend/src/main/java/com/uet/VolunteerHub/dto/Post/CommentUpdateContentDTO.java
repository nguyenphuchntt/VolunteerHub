package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentUpdateContentDTO {

    @NotBlank(message = "Content cannot be blank")
    @Size(min = 1, max = 200, message = "Comment must be between 1 and 200 characters")
    private String content;
}