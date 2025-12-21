package com.uet.VolunteerHub.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitService.class);

    private final RateLimitProperties properties;
    private final StringRedisTemplate redisTemplate;

    // Local cache of buckets with expiration tracking
    private final Map<String, BucketEntry> bucketCache = new ConcurrentHashMap<>();

    // Maximum cache size to prevent memory issues
    private static final int MAX_CACHE_SIZE = 10000;

    // Bucket expiration time (buckets unused for this duration will be removed)
    private static final Duration BUCKET_EXPIRATION = Duration.ofMinutes(10);

    public enum RateLimitType {
        DEFAULT,
        LOGIN,
        REGISTER,
        PUBLIC,
        FORGOT_PASSWORD,
        RESEND_VERIFICATION
    }

    public RateLimitService(RateLimitProperties properties, StringRedisTemplate redisTemplate) {
        this.properties = properties;
        this.redisTemplate = redisTemplate;
    }

    public RateLimitResult tryConsume(String clientId, RateLimitType limitType) {
        if (!properties.isEnabled()) {
            return RateLimitResult.allowed(Integer.MAX_VALUE, 0);
        }

        // Validate client ID to prevent cache pollution
        if (clientId == null || clientId.isEmpty() || clientId.length() > 45) {
            logger.warn("Invalid client ID: {}", clientId);
            return RateLimitResult.allowed(Integer.MAX_VALUE, 0);
        }

        String bucketKey = createBucketKey(clientId, limitType);

        // Check cache size before adding new entries
        if (bucketCache.size() >= MAX_CACHE_SIZE) {
            cleanupExpiredBuckets();
            if (bucketCache.size() >= MAX_CACHE_SIZE) {
                logger.warn("Bucket cache is full, rate limiting may be inconsistent");
                // Still allow the request but don't cache
                return RateLimitResult.allowed(1, 0);
            }
        }

        BucketEntry entry = bucketCache.compute(bucketKey, (key, existing) -> {
            if (existing == null || existing.isExpired()) {
                return new BucketEntry(createBucket(limitType));
            }
            existing.updateLastAccess();
            return existing;
        });

        ConsumptionProbe probe = entry.getBucket().tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            trackInRedis(bucketKey);
            return RateLimitResult.allowed(
                    (int) probe.getRemainingTokens(),
                    Math.max(1, probe.getNanosToWaitForRefill() / 1_000_000_000)
            );
        } else {
            long retryAfterSeconds = Math.max(1, probe.getNanosToWaitForRefill() / 1_000_000_000);
            logger.warn("Rate limit exceeded for client: {} on endpoint type: {}. Retry after: {}s",
                    clientId, limitType, retryAfterSeconds);
            return RateLimitResult.rejected(
                    (int) probe.getRemainingTokens(),
                    retryAfterSeconds
            );
        }
    }

    private Bucket createBucket(RateLimitType limitType) {
        RateLimitProperties.LimitConfig config = getConfigForType(limitType);

        Bandwidth limit = Bandwidth.builder()
                .capacity(config.getLimit())
                .refillGreedy(config.getLimit(), Duration.ofSeconds(config.getDurationSeconds()))
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private RateLimitProperties.LimitConfig getConfigForType(RateLimitType limitType) {
        return switch (limitType) {
            case LOGIN -> properties.getLogin();
            case REGISTER -> properties.getRegister();
            case PUBLIC -> properties.getPublic();
            case FORGOT_PASSWORD -> properties.getForgotPassword();
            case RESEND_VERIFICATION -> properties.getResendVerification();
            default -> properties.getDefaultLimit();
        };
    }

    private String createBucketKey(String clientId, RateLimitType limitType) {
        return String.format("rate_limit:%s:%s", limitType.name().toLowerCase(), clientId);
    }

    private void trackInRedis(String bucketKey) {
        try {
            String redisKey = "ratelimit:tracking:" + bucketKey;
            redisTemplate.opsForValue().increment(redisKey);
            redisTemplate.expire(redisKey, Duration.ofMinutes(5));
        } catch (Exception e) {
            logger.debug("Failed to track rate limit in Redis: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupExpiredBuckets() {
        int removedCount = 0;
        var iterator = bucketCache.entrySet().iterator();
        while (iterator.hasNext()) {
            var entry = iterator.next();
            if (entry.getValue().isExpired()) {
                iterator.remove();
                removedCount++;
            }
        }
        if (removedCount > 0) {
            logger.debug("Cleaned up {} expired rate limit buckets", removedCount);
        }
    }
    public void clearBucket(String clientId, RateLimitType limitType) {
        String bucketKey = createBucketKey(clientId, limitType);
        bucketCache.remove(bucketKey);
    }

    public RateLimitProperties.LimitConfig getConfig(RateLimitType limitType) {
        return getConfigForType(limitType);
    }

    public int getCacheSize() {
        return bucketCache.size();
    }

    private static class BucketEntry {
        private final Bucket bucket;
        private Instant lastAccess;

        BucketEntry(Bucket bucket) {
            this.bucket = bucket;
            this.lastAccess = Instant.now();
        }

        Bucket getBucket() {
            return bucket;
        }

        void updateLastAccess() {
            this.lastAccess = Instant.now();
        }

        boolean isExpired() {
            return Instant.now().isAfter(lastAccess.plus(BUCKET_EXPIRATION));
        }
    }

    public static class RateLimitResult {
        private final boolean allowed;
        private final int remainingTokens;
        private final long retryAfterSeconds;

        private RateLimitResult(boolean allowed, int remainingTokens, long retryAfterSeconds) {
            this.allowed = allowed;
            this.remainingTokens = remainingTokens;
            this.retryAfterSeconds = retryAfterSeconds;
        }

        public static RateLimitResult allowed(int remainingTokens, long resetSeconds) {
            return new RateLimitResult(true, remainingTokens, Math.max(0, resetSeconds));
        }

        public static RateLimitResult rejected(int remainingTokens, long retryAfterSeconds) {
            return new RateLimitResult(false, remainingTokens, Math.max(1, retryAfterSeconds));
        }

        public boolean isAllowed() {
            return allowed;
        }

        public int getRemainingTokens() {
            return remainingTokens;
        }

        public long getRetryAfterSeconds() {
            return retryAfterSeconds;
        }
    }
}
