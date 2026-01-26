package com.backend.imechanic.controller.response;

public record WorkshopResponse(String message, String email, boolean verificationRequired) {
}
