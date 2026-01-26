package com.backend.imechanic.controller.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@JsonIgnoreProperties
public record WorkshopRegisterRequest(

        @NotBlank(message = "The field 'workshopName' is required")
        String workshopName,

        @NotBlank(message = "The field 'ownerName' is required")
        String ownerName,

        @Email(message = "The email does not have a valid format.")
        @NotBlank(message = "The field 'email' is required")
        String email,

        @NotBlank(message = "The field 'password' is required")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[a-z0-9])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,}$")
        String password,
        String address,

        @NotBlank(message = "The field 'phone' is required")
        @Pattern(regexp = "^9\\d{8}$", message = "Phone must start with 9 and have 9 digits")
        String phone
) {
}
