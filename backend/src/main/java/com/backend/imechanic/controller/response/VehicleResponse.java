package com.backend.imechanic.controller.response;

public record VehicleResponse(
        String ownerId,
        String plate,
        String model,
        String brand,
        String year
) {
}
