package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentUpdateContentDTO {

    @NotBlank(message = "Content cannot be blank")
    @Size(min = 1, max = 300, message = "Comment's length must be between 1 and 300 characters")
    private String content;
}