package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record WorkshopRequest(
        @Email(message = "The email does not have a valid format.")
        @NotBlank(message = "The field 'email' is required")
        String email,

        @NotBlank(message = "The field 'password' is required")
//        @Pattern(regexp = "")
        String password,

        @NotBlank(message = "The field 'ownerName' is required")
        String ownerName,

        @NotBlank(message = "The field 'workshopName' is required")
        String workshopName,
        String address,

        @NotBlank(message = "The field 'phone' is required")
        String phone) {
}
