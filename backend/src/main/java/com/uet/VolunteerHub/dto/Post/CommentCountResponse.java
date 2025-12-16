package com.uet.VolunteerHub.dto.Post;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentCountResponse {
    private Long count;
}