package com.backend.imechanic.controller.response;

import java.math.BigDecimal;
import java.util.List;

public record CloseOrderResponse(
        Long orderId,
        String customer,
        String closingDate,
        BreakdownResponse breakdown,
        List<ServiceResponse> items
) {
    public record BreakdownResponse(
            BigDecimal discount,
            BigDecimal totalAmount
    ) {}

    public record ServiceResponse(
            String name,
            String type,
            BigDecimal price
    ) {}
}
