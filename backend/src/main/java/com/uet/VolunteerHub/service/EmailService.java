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
    public void sendOtp(String toEmail, String otp, String username,
                        int expiryMinutes, String templateName, String subject) {
        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("username", username);
        context.setVariable("expiryMinutes", expiryMinutes);
        context.setVariable("senderName", senderName);
        sendHtml(toEmail, subject, templateName, context, "OTP");
    }

    /**
     * Sends password reset confirmation email after successful password change.
     * The template receives {@code username} and {@code senderName}.
     *
     * @param toEmail recipient email address
     * @param username recipient's username for personalization
     */
    @Async
    public void sendPasswordResetConfirmationEmail(String toEmail, String username) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("senderName", senderName);
        sendHtml(toEmail, "Password Changed Successfully", "password-reset-confirmation-email", context,
                "Password reset confirmation");
    }

    /**
     * Renders the template, applies the sender identity and hands the message to the mail server.
     * Failures are logged rather than propagated: callers are async flows whose main
     * transaction must not fail because a mail server is unreachable.
     *
     * @param description short label used in log messages, e.g. "OTP"
     */
    private void sendHtml(String toEmail, String subject, String templateName,
                          Context context, String description) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );
            String htmlContent = templateEngine.process(templateName, context);
            helper.setTo(toEmail);
            helper.setSubject("[" + senderName + "] " + subject);
            helper.setFrom(fromEmail, senderName);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("{} email sent successfully to: {}", description, toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send {} email to: {}. Error: {}", description, toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while sending {} email to: {}. Error: {}", description, toEmail, e.getMessage());
        }
    }
}
