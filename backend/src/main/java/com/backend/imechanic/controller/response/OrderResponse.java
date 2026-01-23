package com.backend.imechanic.controller.response;

import java.util.List;

public record OrderResponse(
        VehicleResponse vehicle,
        List<ItemResponse> items,
        String totalCost
) {
    public record VehicleResponse(
            Long id,
            String plate,
            CustomerResponse customer
    ) {
    }

    public record CustomerResponse(
            Long id,
            String email
    ) {
    }

}
