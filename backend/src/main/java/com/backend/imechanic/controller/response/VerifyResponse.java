package com.backend.imechanic.controller.response;

public record VerifyResponse(
        boolean success,
        String message
) {
}
