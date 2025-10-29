package com.uet.VolunteerHub.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostReadDTO {
    private Long postId;
    private String content;

//    private OffsetDateTime createAt;
//
//    private String eventTitle;
//
//    private String accountUsername;


}


