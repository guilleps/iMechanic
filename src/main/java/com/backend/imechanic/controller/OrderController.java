package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.OrderRequest;
import com.backend.imechanic.controller.response.OrderResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.OrderService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN') or hasAuthority('ROLE_EMPLOYEE')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<@NonNull OrderResponse> create(
            @Valid @RequestBody OrderRequest request,
            Authentication auth
    ) {
        UserEntity creator = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, creator));
    }
}
