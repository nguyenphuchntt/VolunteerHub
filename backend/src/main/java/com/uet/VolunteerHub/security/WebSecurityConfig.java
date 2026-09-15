package com.uet.VolunteerHub.security;

import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    private final AccountRepository accountRepository;

    @Autowired
    public WebSecurityConfig(final JwtTokenProvider jwtTokenProvider, final AccountRepository accountRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.accountRepository = accountRepository;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, accountRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public UserDetailsService userDetailsService(AccountRepository accountRepository) {
        return input -> accountRepository.findByUsernameOrEmail(input, input)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + input + " not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authorizationManagerRequestMatcherRegistry -> authorizationManagerRequestMatcherRegistry
                                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN")
                                // .requestMatchers("/api/manager/**").isAuthenticated()
                                .requestMatchers("/api/posts/**").permitAll()
                                .requestMatchers("/api/users/**").permitAll()
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/api/events/search-public").permitAll()
                                .requestMatchers("/api/events/hot").permitAll()
                                .requestMatchers("/api/media/download/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/events/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/comments/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/media/**").permitAll()
                                .requestMatchers("/api-docs/**").permitAll()
                                .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}
