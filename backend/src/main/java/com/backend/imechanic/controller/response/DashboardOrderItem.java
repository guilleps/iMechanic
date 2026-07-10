package com.backend.imechanic.controller.response;

import com.backend.imechanic.enums.StatusOrder;

public record DashboardOrderItem(
        long id,
        String brand,
        String model,
        String plate,
        String customerName,
        StatusOrder status
) {
}