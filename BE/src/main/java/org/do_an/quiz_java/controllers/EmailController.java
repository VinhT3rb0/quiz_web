package org.do_an.quiz_java.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.quiz_java.services.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static java.awt.SystemColor.text;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix:/api/v1}/email")
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/send-mail")
    public String sendMail(@RequestParam String to, @RequestParam String subject, @RequestParam String text) {
        log.info("Sending email to: " + to+ " with subject: " + subject + " and text: " + text);
        emailService.sendEmail(to, subject, text);
        return "Email sent successfully!";
    }
}
