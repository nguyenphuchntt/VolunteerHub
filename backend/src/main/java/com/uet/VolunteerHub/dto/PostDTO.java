package com.uet.VolunteerHub.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
public class PostDTO {
    private Long postId;

}
