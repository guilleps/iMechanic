package com.backend.imechanic.exception;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(String message) {
        super("The email " + message + " already registered");
    }

    public EmailAlreadyRegisteredException() {
        super("Email already registered");
    }
}
