package com.uet.VolunteerHub.ratelimit;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ratelimit")
public class RateLimitProperties {

    private boolean enabled = true;
    private LimitConfig defaultLimit = new LimitConfig(100, 60);
    private LimitConfig login = new LimitConfig(5, 60);
    private LimitConfig register = new LimitConfig(3, 60);
    private LimitConfig publicEndpoint = new LimitConfig(50, 60);

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LimitConfig getDefaultLimit() {
        return defaultLimit;
    }

    public void setDefault(LimitConfig defaultLimit) {
        this.defaultLimit = defaultLimit;
    }

    public LimitConfig getLogin() {
        return login;
    }

    public void setLogin(LimitConfig login) {
        this.login = login;
    }

    public LimitConfig getRegister() {
        return register;
    }

    public void setRegister(LimitConfig register) {
        this.register = register;
    }

    public LimitConfig getPublic() {
        return publicEndpoint;
    }

    public void setPublic(LimitConfig publicEndpoint) {
        this.publicEndpoint = publicEndpoint;
    }

    public static class LimitConfig {
        private int limit;
        private int durationSeconds;

        public LimitConfig() {
        }

        public LimitConfig(int limit, int durationSeconds) {
            this.limit = limit;
            this.durationSeconds = durationSeconds;
        }

        public int getLimit() {
            return limit;
        }

        public void setLimit(int limit) {
            this.limit = limit;
        }

        public int getDurationSeconds() {
            return durationSeconds;
        }

        public void setDurationSeconds(int durationSeconds) {
            this.durationSeconds = durationSeconds;
        }
    }
}
