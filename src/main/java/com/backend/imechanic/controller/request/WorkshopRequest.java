package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WorkshopRequest(
        @Email
        @NotBlank
        String email,

        @NotBlank
//        @Pattern(regexp = "")
        String password,

        @NotBlank
        String ownerName,

        @NotBlank
        String workshopName,
        String address,

        @NotNull
        String phone) {
}
