package com.backend.imechanic.exception;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<@NonNull BodyError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
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

        logError("VALIDATION_ERROR", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<@NonNull BodyError> handleEmailAlreadyRegisteredException(EmailAlreadyRegisteredException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        BodyError bodyError = new BodyError(
                "EMAIL_ALREADY_REGISTERED",
                "That email address is already registered. Please use another one or log in.",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("EMAIL_ALREADY_REGISTERED", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<@NonNull BodyError> handleJwtVerification(JWTVerificationException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        BodyError bodyError = new BodyError(
                "VERIFY_TOKEN_INVALID",
                "Token inválido o expirado.",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("VERIFY_TOKEN_INVALID", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<@NonNull BodyError> handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BodyError bodyError = new BodyError(
                "BAD_REQUEST",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("BAD_REQUEST", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<@NonNull BodyError> handleBadRequest(UserNotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        BodyError bodyError = new BodyError(
                "NOT_FOUND",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("NOT_FOUND", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(InvalidVerificationTokenException.class)
    public ResponseEntity<@NonNull BodyError> handleBadRequest(InvalidVerificationTokenException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BodyError bodyError = new BodyError(
                "BAD_REQUEST",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("BAD_REQUEST", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<@NonNull BodyError> badCredentials(BadCredentialsException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        BodyError bodyError = new BodyError(
                "INVALID_CREDENTIALS",
                "Invalid credentials",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("INVALID_CREDENTIALS", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<@NonNull BodyError> disabled(DisabledException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_DISABLED",
                "Your account is not yet verified",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("ACCOUNT_DISABLED", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<@NonNull BodyError> locked(LockedException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_LOCKED",
                "Account blocked",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("ACCOUNT_LOCKED", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler({
            CredentialsExpiredException.class,
            AccountExpiredException.class
    })
    public ResponseEntity<@NonNull BodyError> expired(CredentialsExpiredException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "ACCOUNT_EXPIRED",
                "Your account or credentials have expired",
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("ACCOUNT_EXPIRED", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<@NonNull BodyError> handleEntityNotFoundException(EntityNotFoundException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;

        BodyError bodyError = new BodyError(
                "NOT_FOUND",
                ex.getMessage(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("NOT_FOUND", ex, request);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<@NonNull BodyError> forbidden(AccessDeniedException ex, HttpServletRequest req) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        BodyError bodyError = new BodyError(
                "FORBIDDEN",
                ex.getMessage(),
                status.value(),
                req.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("FORBIDDEN", ex, req);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<@NonNull BodyError> conflict(DataIntegrityViolationException ex, HttpServletRequest req) {
        HttpStatus status = HttpStatus.CONFLICT;

        BodyError bodyError = new BodyError(
                "CONFLICT",
                ex.getMessage(),
                status.value(),
                req.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("CONFLICT", ex, req);
        return ResponseEntity.status(status).body(bodyError);
    }

    @ExceptionHandler(UnrecognizedPropertyException.class)
    public ResponseEntity<@NonNull BodyError> handleUnknownField(
            UnrecognizedPropertyException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        BodyError body = new BodyError(
                "UNKNOWN_FIELD",
                "Field not allowed: " + ex.getPropertyName(),
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("UNKNOWN_FIELD", ex, request);
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<@NonNull BodyError> handleIllegalStateException(IllegalStateException ex, HttpServletRequest req) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        BodyError bodyError = new BodyError(
                "INTERNAL_SERVER_ERROR",
                ex.getMessage(),
                status.value(),
                req.getRequestURI(),
                OffsetDateTime.now(),
                null
        );

        logError("INTERNAL_SERVER_ERROR", ex, req);
        return ResponseEntity.status(status).body(bodyError);
    }

    private void logError(String code, Exception ex, HttpServletRequest request) {
        log.error("[{}] Error in {}: {}", code, request.getRequestURI(), ex.getMessage(), ex);
    }
}
