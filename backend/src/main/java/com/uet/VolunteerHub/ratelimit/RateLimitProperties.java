package com.uet.VolunteerHub.ratelimit;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ratelimit")
@Getter
public class RateLimitProperties {

    private final boolean enabled = true;

    private LimitConfig defaultLimit = new LimitConfig(100, 60);
    @Setter
    private LimitConfig login = new LimitConfig(5, 60);
    @Setter
    private LimitConfig register = new LimitConfig(3, 60);
    @Setter
    private LimitConfig publicEndpoint = new LimitConfig(50, 60);
    @Setter
    private LimitConfig forgotPassword = new LimitConfig(3, 60);
    @Setter
    private LimitConfig resendVerification = new LimitConfig(3, 60);
    @Setter
    private LimitConfig otpVerify = new LimitConfig(10, 60);

    public void setDefault(LimitConfig defaultLimit) {
        this.defaultLimit = defaultLimit;
    }

    @Getter
    @Setter
    public static class LimitConfig {

        private int capacity;
        private int durationSeconds;

        public LimitConfig() {
        }

        public LimitConfig(int capacity, int durationSeconds) {
            this.capacity = capacity;
            this.durationSeconds = durationSeconds;
        }
    }
}