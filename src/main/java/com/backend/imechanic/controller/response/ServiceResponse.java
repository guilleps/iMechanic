package com.backend.imechanic.controller.response;

import java.math.BigDecimal;

public record ServiceResponse(
        String name,
        String description,
        String category,
        BigDecimal basePrice,
        boolean active
) {
}
