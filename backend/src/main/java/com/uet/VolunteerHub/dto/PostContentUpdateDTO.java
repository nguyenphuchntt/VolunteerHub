package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostContentUpdateDTO {
    @NotBlank(message = "Content cannot be blank")
    @Size(max = 500, message = "Post content must not exceed 500 characters")
    private String content;
}