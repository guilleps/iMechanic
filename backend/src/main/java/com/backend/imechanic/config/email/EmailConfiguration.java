package com.backend.imechanic.config.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfiguration {

    private final String email;
    private final String password;

    public EmailConfiguration(
            @Value("${spring.mail.username}") String email,
            @Value("${spring.mail.password}") String password
    ) {
        this.email = email;
        this.password = password;
    }

    @Bean
    JavaMailSender mailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setProtocol("smtp");
        javaMailSender.setHost("smtp.gmail.com");
        javaMailSender.setPort(587);
        javaMailSender.setDefaultEncoding("UTF-8");
        javaMailSender.setUsername(email);
        javaMailSender.setPassword(password);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");

        javaMailSender.setJavaMailProperties(props);
        return javaMailSender;
    }
}
