package com.backend.imechanic.controller.response;

public record DashboardEmployee(
        String fullName,
        int activeOrders
) {
}
