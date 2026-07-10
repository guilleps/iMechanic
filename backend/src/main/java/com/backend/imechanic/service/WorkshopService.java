package com.backend.imechanic.service;

import com.backend.imechanic.controller.response.DashboardEmployee;
import com.backend.imechanic.controller.response.DashboardOrderItem;
import com.backend.imechanic.controller.response.DashboardResponse;
import com.backend.imechanic.enums.StatusOrder;
import com.backend.imechanic.model.*;
import com.backend.imechanic.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkshopService {
    private final WorkshopRepository workshopRepository;

    public DashboardResponse getDashboard(UserEntity admin) {
        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workshop not found"));

        List<Order> orders = workshop.getOrders();

        int totalVehicles = (int) orders.stream()
                .map(Order::getVehicle)
                .map(Vehicle::getPlate)
                .distinct()
                .count();

        int inProcess = (int) orders.stream()
                .filter(order -> order.getStatus() == StatusOrder.IN_PROGRESS)
                .count();

        int deliveredToday = (int) orders.stream()
                .filter(order -> order.getStatus() == StatusOrder.DELIVERED)
                .count();

        BigDecimal monthlyIncome = orders.stream()
                .map(order -> order.getItems()
                        .stream()
                        .map(Item::getPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DashboardOrderItem> activeOrders = orders.stream()
                .filter(order -> order.getStatus() != StatusOrder.DELIVERED)
                .map(order -> {
                    Vehicle v = order.getVehicle();
                    long id = v.getId();
                    String brand = v.getBrand();
                    String model = v.getModel();
                    String plate = v.getPlate();
                    String customer = v.getCustomer().getFullName();
                    return new DashboardOrderItem(id, brand, model, plate, customer, order.getStatus());
                })
                .toList();

        List<DashboardEmployee> activeEmployees = orders.stream()
                .filter(order -> order.getStatus() != StatusOrder.DELIVERED)
                .flatMap(order -> order.getItems().stream())
                .map(Item::getEmployee)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        e -> e.getUser().getProfile().getFullName(),
                        Collectors.reducing(0, e -> 1, Integer::sum)
                ))
                .entrySet()
                .stream()
                .map(entry -> new DashboardEmployee(entry.getKey(), entry.getValue()))
                .toList();

        return new DashboardResponse(
                totalVehicles,
                inProcess,
                deliveredToday,
                monthlyIncome,
                activeOrders,
                activeEmployees
        );
    }
}
