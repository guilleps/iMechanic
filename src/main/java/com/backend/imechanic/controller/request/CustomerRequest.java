package com.backend.imechanic.controller.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties
public record CustomerRequest(
        @Email(message = "The email does not have a valid format.")
        @NotBlank(message = "The field 'email' is required")
        String email,

        @NotBlank(message = "The field 'password' is required")
//        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[a-z0-9])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,}$")
        String password,

        @NotBlank(message = "The field 'firstName' is required")
        String firstName,

        @NotBlank(message = "The field 'lastName' is required")
        String lastName,

        @NotBlank(message = "The field 'phone' is required")
        String phone) {
}
