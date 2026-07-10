package com.backend.imechanic.controller.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        int totalVehicles,
        int inProcess,
        int deliveredToday,
        BigDecimal monthlyIncome,
        List<DashboardOrderItem> activeOrders,
        List<DashboardEmployee> activeEmployees
) {
}
