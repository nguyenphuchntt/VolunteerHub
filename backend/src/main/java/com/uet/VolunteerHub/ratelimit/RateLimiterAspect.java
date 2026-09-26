package com.uet.VolunteerHub.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class RateLimiterAspect {

    private final RateLimiterService rateLimiterService;
    private final HttpServletRequest request;
    private final HttpServletResponse response;

    @Around("@annotation(rateLimited)")
    public Object rateLimit(
            ProceedingJoinPoint joinPoint,
            RateLimited rateLimited
    ) throws Throwable {

        String endpoint = rateLimited.value();

        String identifier =
                "ip:" + request.getRemoteAddr();

        RateLimitResult result =
                rateLimiterService.tryConsume(
                        identifier,
                        endpoint
                );

        if (!result.isAllowed()) {
            response.setStatus(
                    HttpStatus.TOO_MANY_REQUESTS.value()
            );

            response.setHeader(
                    "Retry-After",
                    String.valueOf(
                            result.getRetryAfterSeconds()
                    )
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write("""
                    {
                        "error": "Too many requests",
                        "message": "Rate limit exceeded"
                    }
                    """);

            return null;
        }

        response.setHeader(
                "X-RateLimit-Remaining",
                String.valueOf(
                        result.getRemainingTokens()
                )
        );

        return joinPoint.proceed();
    }
}