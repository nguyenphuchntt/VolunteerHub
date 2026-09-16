package com.uet.VolunteerHub.service.otp;

import com.uet.VolunteerHub.configuration.OtpProperties;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class OtpGenerator {

    private final SecureRandom secureRandom = new SecureRandom();
    private final OtpProperties properties;

    public OtpGenerator(OtpProperties properties) {
        this.properties = properties;
    }

    /**
     * Generates a numeric OTP of the configured length.
     */
    public String generate(int length) {
        int bound = (int) Math.pow(10, length);
        int otp = secureRandom.nextInt(bound);
        return String.format("%0" + length + "d", otp);
    }

    /**
     * Computes HMAC-SHA256 hash of the OTP with the configured pepper.
     */
    public String hash(String otp) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(
                    properties.getPepper().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(otp.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("HMAC-SHA256 not available", e);
        }
    }

    /**
     * Verifies OTP against stored hash using constant-time comparison.
     */
    public boolean matches(String rawOtp, String storedHash) {
        String computedHash = hash(rawOtp);
        return MessageDigest.isEqual(
                computedHash.getBytes(StandardCharsets.UTF_8),
                storedHash.getBytes(StandardCharsets.UTF_8)
        );
    }
}
