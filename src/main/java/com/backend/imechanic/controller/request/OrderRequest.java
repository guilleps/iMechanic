package com.backend.imechanic.controller.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record OrderRequest(
        @NotBlank(message = "The field 'plate' is required")
        String plate,

        @Nullable
        String description,

        List<OrderItemRequest> items
) {
    public record OrderItemRequest(
            @NotBlank(message = "The field 'serviceId' is required")
            Long serviceId,

            @NotBlank(message = "The field 'employeeId' is required")
            Long employeeId
    ) {
    }
}
