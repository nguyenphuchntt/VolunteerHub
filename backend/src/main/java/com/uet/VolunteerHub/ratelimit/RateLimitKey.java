package com.uet.VolunteerHub.ratelimit;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class RateLimitKey {
    private static final String PREFIX = "ratelimit:";

    public static String of(String identifier, String endpointType) {
        return PREFIX + identifier + ":" + endpointType;
    }
}
