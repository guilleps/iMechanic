package com.backend.imechanic.exception;

import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BodyError> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        List<BodyError.FieldError> fields = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new BodyError.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        BodyError bodyError = new BodyError(
                "VALIDATION_ERROR",
                "Revisa los campos enviados.",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                fields
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<BodyError> handleEmailAlreadyRegisteredException(
            EmailAlreadyRegisteredException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.CONFLICT;

        BodyError bodyError = new BodyError(
                "EMAIL_ALREADY_REGISTERED",
                "That email address is already registered. Please use another one or log in.",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<BodyError> handleJwtVerification(
            JWTVerificationException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        BodyError bodyError = new BodyError(
                "VERIFY_TOKEN_INVALID",
                "Token inválido o expirado.",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BodyError> handleBadRequest(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BodyError bodyError = new BodyError(
                "BAD_REQUEST",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<BodyError> handleBadRequest(
            UserNotFoundException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        BodyError bodyError = new BodyError(
                "NOT_FOUND",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(InvalidVerificationTokenException.class)
    public ResponseEntity<BodyError> handleBadRequest(
            InvalidVerificationTokenException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BodyError bodyError = new BodyError(
                "BAD_REQUEST",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BodyError> badCredentials(
            BadCredentialsException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        BodyError bodyError = new BodyError(
                "INVALID_CREDENTIALS",
                "Invalid credentials",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<BodyError> disabled(
            DisabledException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_DISABLED",
                "Your account is not yet verified",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<BodyError> locked(
            LockedException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_LOCKED",
                "Account blocked",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler({
            CredentialsExpiredException.class,
            AccountExpiredException.class
    })
    public ResponseEntity<BodyError> expired(
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_EXPIRED",
                "Your account or credentials have expired",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        return ResponseEntity.status(status).body(bodyError);
    }
}
