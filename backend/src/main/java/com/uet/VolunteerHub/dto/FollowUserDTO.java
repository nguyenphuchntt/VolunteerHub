package com.uet.VolunteerHub.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class FollowUserDTO {
    private UUID accountId;
    private UUID followedByAccountId;
    private String username;
    private String fullName;
    private String followByUsername;
    private String followByFullName;
}
