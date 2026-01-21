package com.backend.imechanic.controller.response;

import java.math.BigDecimal;

public record ItemResponse(
        Long id,
        ServiceResponse service,
        BigDecimal price
) {
}
