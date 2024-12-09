package org.do_an.quiz_java.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;  // Correct import
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Service
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender ;
    private final SpringTemplateEngine thymeleafTemplateEngine;

    // Add this field to store the email username
//    @Value("${spring.mail.username}")
//    private String username;


    public void sendMessageHtml(String to, String subject, String template, Map<String, Object> attributes) throws MessagingException {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(attributes);
        String htmlBody = thymeleafTemplateEngine.process(template, thymeleafContext);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Use the injected username as the sender's email address
        //helper.setFrom(username);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }

    /**
     * Sends a simple text-based email.
     * @param to The recipient's email address.
     * @param subject The subject of the email.
     * @param text The body of the email.
     */
    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        //message.setFrom(username); // Set the sender's email address

        mailSender.send(message);
    }

    public void sendVerificationEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
//        helper.setFrom(username); // Set the sender's email address
//        log.info("Sending email from: " + username);
        mailSender.send(message);
    }
}
