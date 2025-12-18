package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowUserId {
    private UUID accountId;
    private UUID followedByAccountId;
}
