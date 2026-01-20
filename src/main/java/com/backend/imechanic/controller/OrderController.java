package com.backend.imechanic.controller;

import com.backend.imechanic.controller.response.OrderResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN') or hasAuthority('ROLE_EMPLOYEE')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/{plate}")
    public ResponseEntity<OrderResponse> create(
            @PathVariable String plate,
            @RequestBody List<Long> serviceIds,
            Authentication auth
    ) {
        UserEntity creator = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(plate, serviceIds, creator));
    }
}
