package com.backend.imechanic.service;

import com.backend.imechanic.controller.response.OrderResponse;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.model.*;
import com.backend.imechanic.repository.CatalogRepository;
import com.backend.imechanic.repository.OrderRepository;
import com.backend.imechanic.repository.VehicleRepository;
import com.backend.imechanic.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final CatalogRepository catalogRepository;
    private final WorkshopRepository workshopRepository;

    @Transactional
    public OrderResponse create(String plate, List<Long> serviceIds, UserEntity creator) {
        Workshop workshop = workshopRepository.findByUserId(creator.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found"));

        Vehicle vehicle = vehicleRepository.findVehicleByPlate(plate)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        List<Catalog> services = catalogRepository.findByIdAndWorkshop_IdAndActiveTrue(serviceIds, workshop.getId());

        if (services.size() != serviceIds.size()) {
            throw new EntityNotFoundException("One or more services were not found");
        }

        Order order = Order.builder()
                .vehicle(vehicle)
                .workshop(workshop)
                .build();

        List<Item> items = services.stream()
                .map(s -> Item.builder()
                        .order(order)
                        .service(s)
                        .price(s.getBasePrice())
                        .build()
                ).toList();

        order.setItems(items);

        BigDecimal totalCost = items.stream()
                .map(Item::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalCost(totalCost);

        orderRepository.save(order);

        return new OrderResponse(vehicle, items, totalCost.toString());
    }

}
