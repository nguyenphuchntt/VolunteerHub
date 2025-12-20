package com.uet.VolunteerHub.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Example usage:
 * <pre>
 * {@code @RateLimited(limit = 10, durationSeconds = 60)}
 * public ResponseEntity<?> sensitiveOperation() { ... }
 * </pre>
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {
    int limit() default 100;

    int durationSeconds() default 60;

    String key() default "";

    boolean perUser() default false;
}
