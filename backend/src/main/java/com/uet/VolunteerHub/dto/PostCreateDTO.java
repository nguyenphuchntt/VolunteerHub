package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateDTO {
    @Size(max = 500, message = "Post content must not exceed 500 characters")
    private String content;

    @NotNull(message = "Post type cannot be null")
    private PostType postType;

    private Long eventId;
    private UUID createByAccountId;
}
