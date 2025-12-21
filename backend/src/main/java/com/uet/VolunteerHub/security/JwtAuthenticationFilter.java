package com.uet.VolunteerHub.security;

import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.repository.AccountRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    private final AccountRepository accountRepository;

    @Autowired
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, AccountRepository accountRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.accountRepository = accountRepository;
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            if (jwt != null) {
                UUID accountId = UUID.fromString(jwtTokenProvider.parseJwtToken(jwt).getSubject());
                Account account = accountRepository.findByIdFresh(accountId)
                        .orElseThrow(() -> new EntityNotFoundException("Account with ID: " + accountId + " not found"));
                log.debug("Loaded account {} with role {} and status {}", 
                    accountId, account.getRole(), account.getAccountStatus());
                // Check if account is BANNED - block all operations
                if (account.getAccountStatus() == com.uet.VolunteerHub.enums.AccountStatus.BANNED) {
                    log.warn("Banned account attempted to access: {}", accountId);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\": \"ACCOUNT_BANNED\", \"message\": \"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.\"}");
                    return;
                }
                // Create authentication with FRESH role from database
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(account,
                        null, account.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Expired JWT token\"}");
            return;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to authenticate user: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Illegal JWT token\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
