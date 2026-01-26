package com.backend.imechanic.controller;

import com.backend.imechanic.config.auth.cookie.CookieService;
import com.backend.imechanic.controller.request.LoginRequest;
import com.backend.imechanic.controller.request.WorkshopRegisterRequest;
import com.backend.imechanic.controller.response.LoginResponse;
import com.backend.imechanic.controller.response.VerifyResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<@NonNull WorkshopResponse> register(@Valid @RequestBody WorkshopRegisterRequest request) throws MessagingException {
        WorkshopResponse workshopResponse = userService.register(request);
        return ResponseEntity.status(HttpStatus.OK).body(workshopResponse);
    }

    @GetMapping("/verify-account/{encodedToken}")
    public ResponseEntity<VerifyResponse> verifyAccount(@PathVariable String encodedToken) {
        String token = new String(
                Base64.getUrlDecoder().decode(encodedToken),
                StandardCharsets.UTF_8
        );

        VerifyResponse response = userService.verifyAccount(token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.login(request);

        String setCookieHeader = cookieService.setCookie("access_token", loginResponse.token());

        return ResponseEntity.accepted()
                .header(HttpHeaders.SET_COOKIE, setCookieHeader)
                .body(Map.of(
                        "message", "Access granted",
                        "role", loginResponse.role(),
                        "expiresIn", loginResponse.expiresIn()
                ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        LoginResponse refreshed = userService.refreshAccessToken(request);

        String setCookieHeader = cookieService.setCookie("access_token", refreshed.token());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, setCookieHeader)
                .body(Map.of(
                        "message", "Token refreshed",
                        "role", refreshed.role(),
                        "expiresIn", refreshed.expiresIn()
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        userService.logout(request);

        String clearCookie = cookieService.clearCookie("access_token");

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearCookie)
                .body(Map.of("message", "Logged out"));
    }
}
