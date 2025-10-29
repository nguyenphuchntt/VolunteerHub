package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.PostType;

import java.util.UUID;

public class PostCreateDTO {
    private String content;
    private PostType postType;
    private Long eventId;
    private UUID createdByAccountId;
}
