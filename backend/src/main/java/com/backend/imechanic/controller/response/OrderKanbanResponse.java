package com.backend.imechanic.controller.response;

import com.backend.imechanic.enums.StatusItem;
import com.backend.imechanic.enums.StatusOrder;

import java.math.BigDecimal;
import java.util.List;

public record OrderKanbanResponse(
        String id,
        // ORDERNUMBER? ORD-AÑO-00X
        VehicleResponse vehicle,
        CustomerResponse customer,
        StatusOrder status,
        List<OrderKanbanItemResponse> items,
        BigDecimal totalCost
) {
    public record VehicleResponse(
            long id,
            String plate,
            String brand,
            String model,
            String year
    ) {
    }

    public record CustomerResponse(
            long id,
            String firstName,
            String lastName
    ) {
    }

    public record OrderKanbanItemResponse(
            String name,
            StatusItem status
    ){}

}