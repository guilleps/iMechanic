package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email
        @NotBlank
        String email,

        @NotBlank
//        @Pattern(regexp = "")
        String password
) {
}
