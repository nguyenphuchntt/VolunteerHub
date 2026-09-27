package com.uet.VolunteerHub.ratelimit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final ProxyManager<String> proxyManager;
    private final BucketConfigurationFactory configurationFactory;
    private final RateLimitProperties properties;

    public RateLimitResult tryConsume(
            String identifier,
            String endpointType) {
        RateLimitProperties.LimitConfig config = getLimitConfig(endpointType);
        String key = RateLimitKey.of(identifier, endpointType);
        Bucket bucket = proxyManager
                .builder()
                .build(key, configurationFactory.create(config));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            return new RateLimitResult(true, probe.getRemainingTokens(), 0);
        }
        long retryAfterSeconds = Math.max(1, (long) Math.ceil(probe.getNanosToWaitForRefill() / 1_000_000_000.0));
        return new RateLimitResult(false, 0, retryAfterSeconds);
    }

    private RateLimitProperties.LimitConfig getLimitConfig (String endpointType) {
        return switch (endpointType) {
            case "login" -> properties.getLogin();
            case "register" -> properties.getRegister();
            case "public" -> properties.getPublicEndpoint();
            case "forgot-password" -> properties.getForgotPassword();
            case "resend-verification" -> properties.getResendVerification();
            case "otp-verify" -> properties.getOtpVerify();
            default -> properties.getDefaultLimit();
        };
    }
}
