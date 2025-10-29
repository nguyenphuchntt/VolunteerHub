package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostType;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateDTO {
    private String content;
    private PostType postType;
    private Long eventId;
    private UUID createByAccountId;
}
