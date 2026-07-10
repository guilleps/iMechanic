package com.backend.imechanic.exception;

public class CredentialsExpiredException extends RuntimeException {
    public CredentialsExpiredException(String message) {
        super(message);
    }
}
