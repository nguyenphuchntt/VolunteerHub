package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostTypeUpdateDTO {
    @NotNull(message = "PostType cannot be null")
    private PostType type;
}