package com.uet.VolunteerHub.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;
import java.util.regex.Pattern;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    private final RateLimitService rateLimitService;
    private final RateLimitProperties properties;

    private static final String HEADER_LIMIT = "X-RateLimit-Limit";
    private static final String HEADER_REMAINING = "X-RateLimit-Remaining";
    private static final String HEADER_RESET = "X-RateLimit-Reset";
    private static final String HEADER_RETRY_AFTER = "Retry-After";

    private static final Pattern IPV4_PATTERN = Pattern.compile(
            "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );

    private static final Set<String> TRUSTED_PROXIES = Set.of(
            "127.0.0.1",
            "10.0.0.0/8",      // Private network
            "172.16.0.0/12",   // Private network  
            "192.168.0.0/16"   // Private network
    );

    @Value("${ratelimit.trust-proxy:false}")
    private boolean trustProxy;

    public RateLimitFilter(RateLimitService rateLimitService, RateLimitProperties properties) {
        this.rateLimitService = rateLimitService;
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!properties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        if (shouldSkipRateLimit(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIpAddress(request);

        RateLimitService.RateLimitType limitType = determineLimitType(path, request.getMethod());

        RateLimitService.RateLimitResult result = rateLimitService.tryConsume(clientIp, limitType);

        RateLimitProperties.LimitConfig config = rateLimitService.getConfig(limitType);

        addRateLimitHeaders(response, config.getLimit(), result.getRemainingTokens(), result.getRetryAfterSeconds());

        if (result.isAllowed()) {
            filterChain.doFilter(request, response);
        } else {
            logger.warn("Rate limit exceeded for IP: {} on path: {} (type: {})", clientIp, path, limitType);
            handleRateLimitExceeded(response, result.getRetryAfterSeconds());
        }
    }

    private boolean shouldSkipRateLimit(String path) {
        return path.startsWith("/actuator") ||
                path.startsWith("/api-docs") ||
                path.startsWith("/swagger") ||
                path.equals("/health") ||
                path.equals("/favicon.ico");
    }

    private RateLimitService.RateLimitType determineLimitType(String path, String method) {
        // Authentication endpoints - stricter limits for security-sensitive operations
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/authenticate")) {
            return RateLimitService.RateLimitType.LOGIN;
        }
        if (path.startsWith("/api/auth/register") || path.startsWith("/api/auth/signup")) {
            return RateLimitService.RateLimitType.REGISTER;
        }
        // Forgot password - stricter limit to prevent email spam
        if (path.startsWith("/api/auth/password/forgot") || path.startsWith("/api/auth/password/reset")) {
            return RateLimitService.RateLimitType.FORGOT_PASSWORD;
        }
        if (isPublicEndpoint(path, method)) {
            return RateLimitService.RateLimitType.PUBLIC;
        }

        return RateLimitService.RateLimitType.DEFAULT;
    }

    private boolean isPublicEndpoint(String path, String method) {
        if (path.startsWith("/api/posts/") || path.equals("/api/posts")) {
            return true;
        }
        if (path.startsWith("/api/users/") || path.equals("/api/users")) {
            return true;
        }
        if (path.startsWith("/api/auth/")) {
            return true;
        }

        if ("GET".equalsIgnoreCase(method)) {
            // Events
            if (path.startsWith("/api/events/")) {
                return true;
            }
            if (path.startsWith("/api/comments/") || path.equals("/api/comments")) {
                return true;
            }
            // Media
            if (path.startsWith("/api/media/")) {
                return true;
            }
        }

        return false;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();

        if ("0:0:0:0:0:0:0:1".equals(remoteAddr)) {
            remoteAddr = "127.0.0.1";
        }

        if (trustProxy && isTrustedProxy(remoteAddr)) {
            // Check X-Forwarded-For first (most common)
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                String clientIp = xForwardedFor.split(",")[0].trim();
                if (isValidIpAddress(clientIp)) {
                    return clientIp;
                }
                logger.warn("Invalid IP in X-Forwarded-For header: {}", clientIp);
            }

            // Check X-Real-IP (used by Nginx)
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                String clientIp = xRealIp.trim();
                if (isValidIpAddress(clientIp)) {
                    return clientIp;
                }
                logger.warn("Invalid IP in X-Real-IP header: {}", clientIp);
            }
        }

        return remoteAddr;
    }

    private boolean isTrustedProxy(String remoteAddr) {
        if (TRUSTED_PROXIES.contains(remoteAddr)) {
            return true;
        }
        // Check private IP ranges
        return remoteAddr.startsWith("10.") ||
                remoteAddr.startsWith("172.16.") || remoteAddr.startsWith("172.17.") ||
                remoteAddr.startsWith("172.18.") || remoteAddr.startsWith("172.19.") ||
                remoteAddr.startsWith("172.20.") || remoteAddr.startsWith("172.21.") ||
                remoteAddr.startsWith("172.22.") || remoteAddr.startsWith("172.23.") ||
                remoteAddr.startsWith("172.24.") || remoteAddr.startsWith("172.25.") ||
                remoteAddr.startsWith("172.26.") || remoteAddr.startsWith("172.27.") ||
                remoteAddr.startsWith("172.28.") || remoteAddr.startsWith("172.29.") ||
                remoteAddr.startsWith("172.30.") || remoteAddr.startsWith("172.31.") ||
                remoteAddr.startsWith("192.168.") ||
                remoteAddr.equals("127.0.0.1");
    }

    private boolean isValidIpAddress(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }
        if (IPV4_PATTERN.matcher(ip).matches()) {
            return true;
        }
        if (ip.contains(":") && ip.matches("^[0-9a-fA-F:]+$")) {
            return true;
        }
        return false;
    }

    private void addRateLimitHeaders(HttpServletResponse response, int limit, int remaining, long resetSeconds) {
        response.setHeader(HEADER_LIMIT, String.valueOf(limit));
        response.setHeader(HEADER_REMAINING, String.valueOf(Math.max(0, remaining)));
        response.setHeader(HEADER_RESET, String.valueOf(Instant.now().plusSeconds(Math.max(1, resetSeconds)).getEpochSecond()));
    }

    private void handleRateLimitExceeded(HttpServletResponse response, long retryAfterSeconds) throws IOException {
        // Ensure minimum retry time of 1 second
        long retrySeconds = Math.max(1, retryAfterSeconds);
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader(HEADER_RETRY_AFTER, String.valueOf(retrySeconds));

        String jsonResponse = String.format(
                "{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again after %d seconds.\",\"retryAfter\":%d}",
                retrySeconds,
                retrySeconds
        );
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
}
