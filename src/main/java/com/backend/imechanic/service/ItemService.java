package com.backend.imechanic.service;

import com.backend.imechanic.controller.response.ItemResponse;
import com.backend.imechanic.controller.response.ServiceResponse;
import com.backend.imechanic.enums.StatusItem;
import com.backend.imechanic.enums.StatusOrder;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.model.Employee;
import com.backend.imechanic.model.Item;
import com.backend.imechanic.model.Order;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.repository.EmployeeRepository;
import com.backend.imechanic.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public ItemResponse updateStatus(Long orderId, Long itemId, UserEntity employeeAssigned) {
        Employee employee = employeeRepository
                .findByUser_Id(employeeAssigned.getId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        Long workshopId = employee.getWorkshop().getId();

        Item item = itemRepository
                .findByIdAndOrder_IdAndOrder_Workshop_IdAndEmployee_Id(itemId, orderId, workshopId, employee.getId())
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (item.getStatus() == StatusItem.PENDING) {
            item.setStatus(StatusItem.IN_PROGRESS);
        } else if (item.getStatus() == StatusItem.IN_PROGRESS) {
            item.setStatus(StatusItem.COMPLETED);
        } else {
            throw new IllegalArgumentException("Item is already completed");
        }

        verifiedStatus(item.getOrder());

        return new ItemResponse(
                item.getId(),
                new ServiceResponse(
                        item.getService().getName(),
                        item.getService().getDescription(),
                        item.getService().getCategory().toString(),
                        item.getService().getBasePrice(),
                        item.getService().isActive()
                ),
                item.getPrice()
        );
    }

    private void verifiedStatus(Order order) {

        boolean anyInProgress = order.getItems().stream()
                .anyMatch(item -> item.getStatus() == StatusItem.IN_PROGRESS);

        boolean allCompleted = order.getItems().stream()
                .allMatch(item -> item.getStatus() == StatusItem.COMPLETED);

        if (allCompleted) {
            order.setStatus(StatusOrder.READY);
        } else if (anyInProgress) {
            order.setStatus(StatusOrder.IN_PROGRESS);
        } else {
            order.setStatus(StatusOrder.OPEN);
        }
    }

}
