package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostStatusUpdateDTO {

    @NotNull(message = "Post status cannot be null")
    private PostStatus postStatus;
}