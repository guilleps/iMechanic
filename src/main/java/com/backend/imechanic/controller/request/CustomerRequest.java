package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.*;

public record CustomerRequest(
        @Email
        @NotBlank
        String email,

        @NotBlank
//        @Pattern(regexp = "")
        String password,

        @NotBlank
        String firstName,
        String lastName,

        @NotNull
        String phone) {
}
