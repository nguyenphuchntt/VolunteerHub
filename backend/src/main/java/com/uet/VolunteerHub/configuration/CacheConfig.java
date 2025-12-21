package com.uet.VolunteerHub.configuration;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.SimpleCacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CacheConfig implements CachingConfigurer {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Configure ObjectMapper for proper JSON serialization
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        GenericJackson2JsonRedisSerializer jsonSerializer = 
                new GenericJackson2JsonRedisSerializer(objectMapper);

        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer)
                )
                .disableCachingNullValues();

        // Custom configurations for different cache regions
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // User-related caches - moderate TTL since user data changes occasionally
        cacheConfigurations.put("users", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("userProfiles", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Event-related caches - shorter TTL for active events
        cacheConfigurations.put("events", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigurations.put("eventDetails", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigurations.put("eventLists", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Dashboard statistics - moderate TTL, can be slightly stale
        cacheConfigurations.put("dashboardStats", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("adminDashboard", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("managerDashboard", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Notification count - very short TTL for quasi-realtime
        cacheConfigurations.put("notifications", defaultConfig.entryTtl(Duration.ofSeconds(30)));
        cacheConfigurations.put("notificationCounts", defaultConfig.entryTtl(Duration.ofSeconds(30)));
        
        // Post-related caches
        cacheConfigurations.put("posts", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("postLists", defaultConfig.entryTtl(Duration.ofMinutes(3)));
        
        // Static or rarely changing data - longer TTL
        cacheConfigurations.put("staticData", defaultConfig.entryTtl(Duration.ofHours(1)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }

    /**
     * Custom error handler to gracefully handle cache failures.
     * When Redis is down, the application continues to work by falling back to database.
     */
    @Override
    public CacheErrorHandler errorHandler() {
        return new SimpleCacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, 
                    org.springframework.cache.Cache cache, Object key) {
                System.err.println("Cache get error for key [" + key + "] in cache ["
                        + cache.getName() + "]: " + exception.getMessage());
            }

            @Override
            public void handleCachePutError(RuntimeException exception, 
                    org.springframework.cache.Cache cache, Object key, Object value) {
                System.err.println("Cache put error for key [" + key + "] in cache ["
                        + cache.getName() + "]: " + exception.getMessage());
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, 
                    org.springframework.cache.Cache cache, Object key) {
                System.err.println("Cache evict error for key [" + key + "] in cache [" 
                        + cache.getName() + "]: " + exception.getMessage());
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, 
                    org.springframework.cache.Cache cache) {
                System.err.println("Cache clear error in cache [" 
                        + cache.getName() + "]: " + exception.getMessage());
            }
        };
    }
}
