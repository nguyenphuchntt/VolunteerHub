package com.uet.VolunteerHub.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.password-reset.sender-name}")
    private String senderName;

    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink, String username, int expiryMinutes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );
            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("resetLink", resetLink);
            context.setVariable("expiryMinutes", expiryMinutes);
            context.setVariable("senderName", senderName);
            // Process the email template
            String htmlContent = templateEngine.process("password-reset-email", context);
            helper.setTo(toEmail);
            helper.setSubject("[" + senderName + "] Password Reset Request");
            helper.setFrom(fromEmail, senderName);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}. Error: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while sending password reset email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetConfirmationEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );
            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("senderName", senderName);
            // Process the email template
            String htmlContent = templateEngine.process("password-reset-confirmation-email", context);
            helper.setTo(toEmail);
            helper.setSubject("[" + senderName + "] Password Changed Successfully");
            helper.setFrom(fromEmail, senderName);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Password reset confirmation email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send password reset confirmation email to: {}. Error: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while sending confirmation email to: {}. Error: {}", toEmail, e.getMessage());
        }
    }
}
