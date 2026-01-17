package com.backend.imechanic.config.email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SimpleMailMessage templateMessage;

    @Async("mailExecutor")
    public void sendVerifyAccountEmail(String toEmail, String verifyToken) {
        SimpleMailMessage msg = new SimpleMailMessage(templateMessage);
        msg.setTo(toEmail);
        msg.setText(
                "Hola!\n\n" +
                        "Para verificar tu cuenta en iMechanic, haz clic en el enlace:\n" +
                        verifyToken + "\n\n" +
                        "Este enlace expira en 15 minutos.\n\n" +
                        "Si no fuiste tú, ignora este correo."
        );

        try {
            mailSender.send(msg);
        } catch (MailException ex) {
            System.err.println("Error enviando email a " + toEmail + ": " + ex.getMessage());
        }
    }
}