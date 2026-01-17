package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "The email does not have a valid format.")
        @NotBlank(message = "The field 'email' is required")
        String email,

        @NotBlank(message = "The field 'password' is required")
//        @Pattern(regexp = "")
        String password
) {
}
