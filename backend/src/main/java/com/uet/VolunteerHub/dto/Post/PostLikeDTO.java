package com.uet.VolunteerHub.dto.Post;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeDTO {
    @NotNull
    private Long postId;
    @NotNull
    private UUID accountId;
}
