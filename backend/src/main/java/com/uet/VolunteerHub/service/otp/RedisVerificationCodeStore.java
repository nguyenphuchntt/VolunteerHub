package com.uet.VolunteerHub.service.otp;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Component
public class RedisVerificationCodeStore implements VerificationCodeStore {

    private static final String CODE_PREFIX = "otp:code:";
    private static final String COOLDOWN_PREFIX = "otp:cooldown:";
    private static final String QUOTA_PREFIX = "otp:quota:";

    private static final String FIELD_CODE_HASH = "codeHash";
    private static final String FIELD_ATTEMPTS = "attempts";
    private static final String FIELD_ISSUED_AT = "issuedAt";

    private final StringRedisTemplate redisTemplate;

    public RedisVerificationCodeStore(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(OtpScope scope, String identifier, VerificationCodeEntry entry, Duration ttl) {
        String key = codeKey(scope, identifier);
        redisTemplate.opsForHash().putAll(key, Map.of(
                FIELD_CODE_HASH, entry.codeHash(),
                FIELD_ATTEMPTS, String.valueOf(entry.attempts()),
                FIELD_ISSUED_AT, String.valueOf(entry.issuedAt().toEpochMilli())
        ));
        redisTemplate.expire(key, ttl);
    }

    @Override
    public Optional<VerificationCodeEntry> find(OtpScope scope, String identifier) {
        String key = codeKey(scope, identifier);
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
        if (entries.isEmpty()) {
            return Optional.empty();
        }
        Object codeHash = entries.get(FIELD_CODE_HASH);
        if (codeHash == null) {
            return Optional.empty();
        }
        int attempts = parse(entries.get(FIELD_ATTEMPTS), 0);
        long issuedAt = parse(entries.get(FIELD_ISSUED_AT), Instant.now().toEpochMilli());
        return Optional.of(new VerificationCodeEntry(codeHash.toString(), attempts, Instant.ofEpochMilli(issuedAt)));
    }

    @Override
    public void incrementAttempts(OtpScope scope, String identifier) {
        redisTemplate.opsForHash().increment(codeKey(scope, identifier), FIELD_ATTEMPTS, 1);
    }

    @Override
    public void delete(OtpScope scope, String identifier) {
        redisTemplate.delete(codeKey(scope, identifier));
    }

    @Override
    public boolean tryAcquireCooldown(OtpScope scope, String identifier, Duration cooldown) {
        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(cooldownKey(scope, identifier), "1", cooldown);
        return Boolean.TRUE.equals(acquired);
    }

    @Override
    public long incrementSendCount(OtpScope scope, String identifier, Duration window) {
        String key = quotaKey(scope, identifier);
        Long count = redisTemplate.opsForValue().increment(key);
        if (count != null && count == 1L) {
            redisTemplate.expire(key, window);
        }
        return count == null ? 0L : count;
    }

    private String codeKey(OtpScope scope, String identifier) {
        return CODE_PREFIX + scope.name().toLowerCase() + ":" + identifier;
    }

    private String cooldownKey(OtpScope scope, String identifier) {
        return COOLDOWN_PREFIX + scope.name().toLowerCase() + ":" + identifier;
    }

    private String quotaKey(OtpScope scope, String identifier) {
        return QUOTA_PREFIX + scope.name().toLowerCase() + ":" + identifier;
    }

    private int parse(Object value, int fallback) {
        if (value == null) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private long parse(Object value, long fallback) {
        if (value == null) {
            return fallback;
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }
}
