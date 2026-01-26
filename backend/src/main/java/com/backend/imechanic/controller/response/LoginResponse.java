package com.backend.imechanic.controller.response;

public record LoginResponse(String token, String role, long expiresIn, String jti) {
}
