package com.backend.imechanic.controller.request;

import jakarta.validation.constraints.NotBlank;

public record VehicleRequest(

        @NotBlank(message = "The field 'plate' is required")
        String plate,

        @NotBlank(message = "The field 'model' is required")
        String model,

        @NotBlank(message = "The field 'brand' is required")
        String brand,

        @NotBlank(message = "The field 'year' is required")
        String year
) {
}
