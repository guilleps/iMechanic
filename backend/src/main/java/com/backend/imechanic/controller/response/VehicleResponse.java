package com.backend.imechanic.controller.response;

public record VehicleResponse(
        String plate,
        String model,
        String brand,
        String year,
        String firstName,
        String lastName,
        String phone
) {
}
