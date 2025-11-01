package com.uet.VolunteerHub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostContentUpdateDTO {
    @NotBlank(message = "Content cannot be blank")
    private String content;
}