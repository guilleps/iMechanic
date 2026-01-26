package com.backend.imechanic.config.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async("mailExecutor")
    public void sendVerifyAccountEmail(String toEmail, String verifyToken) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        message.setSubject("Verifica tu cuenta - iMechanic");

        String verificationUrl = "http://localhost:5173/verify-email?token=" + verifyToken;

        String bg = "#E0E0E2";
        String fg = "#232C33";
        String card = "#FFFFFF";
        String border = "#D1D2D4";
        String primary = "#2B4162";
        String primaryFg = "#FFFFFF";
        String mutedFg = "#5C6670";
        String accent = "#5A7D7C";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
                    <tr>
                        <td align="center">
                
                            <!-- Card -->
                            <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                                   style="max-width:600px; width:100%%; background:%s; border:1px solid %s; border-radius:12px; overflow:hidden;">
                
                                <!-- Header -->
                                <tr>
                                    <td style="padding:22px 22px 14px 22px;">
                                        <div style="display:flex; align-items:center; gap:12px;">
                                            <div>
                                                <div style="font-size:18px; font-weight:700; color:%s;">iMechanic</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td style="padding:0 22px 12px 22px;">
                                        <h2 style="margin:0; font-size:20px; color:%s;">Verifica tu cuenta</h2>
                                        <p style="margin:10px 0 0 0; font-size:14px; color:%s; line-height:1.6;">
                                            Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:
                                        </p>
                                    </td>
                                </tr>
                
                                <!-- Button -->
                                <tr>
                                    <td align="center" style="padding:18px 22px 8px 22px;">
                                        <a href="%s"
                                           style="display:inline-block; background:%s; color:%s; text-decoration:none;
                                                                            padding:12px 18px; border-radius:10px; font-weight:700; font-size:14px;">
                                            Verificar mi cuenta
                                        </a>
                                        <div style="margin-top:10px; font-size:12px; color:%s;">
                                            Este enlace expira en 15 minutos.
                                        </div>
                                    </td>
                                </tr>
                
                                <tr>
                                    <td style="padding:18px 22px 20px 22px;">
                                        <hr style="border:none; border-top:1px solid %s; margin:0 0 12px 0;"/>
                                        <p style="margin:0; font-size:12px; color:%s; line-height:1.6;">
                                            Si no fuiste tú, ignora este correo.
                                        </p>
                                        <p style="margin:10px 0 0 0; font-size:12px; color:%s;">
                                            © iMechanic
                                        </p>
                                    </td>
                                </tr>
                
                            </table>
                
                        </td>
                    </tr>
                </table>
                </body>
                </html>
                """.formatted(card, border, fg, fg, mutedFg, verificationUrl, primary, primaryFg, mutedFg, border, mutedFg, mutedFg);

        try {
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MailException ex) {
            System.err.println("Error enviando email a " + toEmail + ": " + ex.getMessage());
        }
    }
}