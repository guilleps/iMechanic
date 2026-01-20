package com.backend.imechanic.controller.response;

import com.backend.imechanic.model.Item;
import com.backend.imechanic.model.Vehicle;

import java.util.List;

public record OrderResponse(
        Vehicle vehicle,
        List<Item> items,
        String totalCost
) {
}
