package com.uet.VolunteerHub.ratelimit;

import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.Bucket4jLettuce;
import io.lettuce.core.RedisClient;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import io.lettuce.core.api.StatefulRedisConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class Bucket4jConfig {

    @Bean
    public ProxyManager<String> bucketProxyManager(
            RedisClient redisClient
    ) {
        StatefulRedisConnection<String, byte[]> connection =
                redisClient.connect(
                        RedisCodec.of(
                                StringCodec.UTF8,
                                ByteArrayCodec.INSTANCE
                        )
                );

        return Bucket4jLettuce
                .casBasedBuilder(connection)
                .expirationAfterWrite(
                        ExpirationAfterWriteStrategy
                                .basedOnTimeForRefillingBucketUpToMax(
                                        Duration.ofSeconds(10)
                                )
                )
                .build();
    }
}