package com.backend.imechanic.service;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.backend.imechanic.config.auth.JWT.JwtService;
import com.backend.imechanic.config.auth.cookie.CookieService;
import com.backend.imechanic.config.email.EmailService;
import com.backend.imechanic.controller.request.LoginRequest;
import com.backend.imechanic.controller.request.WorkshopRegisterRequest;
import com.backend.imechanic.controller.response.LoginResponse;
import com.backend.imechanic.controller.response.VerifyResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.exception.EmailAlreadyRegisteredException;
import com.backend.imechanic.exception.InvalidVerificationTokenException;
import com.backend.imechanic.exception.UserNotFoundException;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final CookieService cookieService;

    public WorkshopResponse register(WorkshopRegisterRequest request) throws MessagingException {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException(email);
        }

        Profile newProfile = Profile.builder()
                .firstName(request.ownerName())
                .lastName(request.ownerName())
                .phone(request.phone())
                .build();

        Workshop newWorkshop = Workshop.builder()
                .name(request.workshopName())
                .address(request.address())
                .phone(request.phone())
                .build();

        UserEntity newUser = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(false)
                .profile(newProfile)
                .workshop(newWorkshop)
                .role(Role.ROLE_WORKSHOP_ADMIN)
                .build();

        newProfile.setUser(newUser);
        newWorkshop.setUser(newUser);

        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        String token = jwtService.generateVerifyToken(newUser.getEmail());
        emailService.sendVerifyAccountEmail(newUser.getEmail(), Base64.getUrlEncoder().withoutPadding()
                .encodeToString(token.getBytes(StandardCharsets.UTF_8)));

        return new WorkshopResponse(
                "Te enviamos un enlace de verificación.",
                newUser.getEmail(),
                !newUser.isEnabled()
        );
    }

    @Transactional
    public VerifyResponse verifyAccount(String token) {

        DecodedJWT jwt;
        try {
            jwt = jwtService.verifyAndAssertType(token, "verify");
        } catch (IllegalArgumentException e) {
            return new VerifyResponse(false, "Token inválido");
        } catch (TokenExpiredException e) {
            return new VerifyResponse(false, "El enlace ha expirado");
        } catch (Exception e) {
            return new VerifyResponse(false, "Error interno del servidor");
        }

        String email = jwt.getSubject();
        if (email == null || email.isBlank()) {
            throw new InvalidVerificationTokenException("Token sin subject");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (user.isEnabled()) return new VerifyResponse(true, "El usuario ya ha sido verificado");

        user.setEnabled(true);
        return new VerifyResponse(true, "Cuenta verificada exitosamente");
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        LoginResponse loginResponse = jwtService.generateToken(userDetails);

        UserEntity user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setJwtId(loginResponse.jti());
        userRepository.save(user);

        return loginResponse;
    }

    public LoginResponse refreshAccessToken(HttpServletRequest request) {
        String token = cookieService.extractCookie(request, "access_token");
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Missing access token");
        }

        var jwt = jwtService.verifyAndAssertType(token, "access");

        String email = jwt.getSubject();
        String tokenJti = jwt.getId();

        if (email == null || email.isBlank() || tokenJti == null || tokenJti.isBlank()) {
            throw new IllegalArgumentException("Invalid token payload");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        LoginResponse newToken = jwtService.generateToken(user);

        user.setJwtId(newToken.jti());
        userRepository.save(user);

        return newToken;
    }

    public void logout(HttpServletRequest request) {
        String token = cookieService.extractCookie(request, "access_token");
        if (token == null || token.isBlank()) return;
        var jwt = jwtService.verify(token);
        String email = jwt.getSubject();

        if (email == null || email.isBlank()) return;

        userRepository.findByEmail(email).ifPresent(user -> {
            user.setJwtId(null);
            userRepository.save(user);
        });
    }
}
