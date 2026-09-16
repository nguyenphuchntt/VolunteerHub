package com.uet.VolunteerHub.dto.Post;

import com.uet.VolunteerHub.enums.PostVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostTypeUpdateDTO {
    @NotNull(message = "PostType cannot be null")
    private PostVisibility type;
}