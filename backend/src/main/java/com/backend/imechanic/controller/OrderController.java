package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.OrderRequest;
import com.backend.imechanic.controller.response.CloseOrderResponse;
import com.backend.imechanic.controller.response.OrderResponse;
import com.backend.imechanic.controller.response.TimelineResponse;
import com.backend.imechanic.controller.response.UploadEvidenceResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.OrderService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN') or hasAuthority('ROLE_EMPLOYEE')")
    public ResponseEntity<@NonNull OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication auth
    ) {
        UserEntity creator = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, creator));
    }

    @PatchMapping("/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
    public ResponseEntity<@NonNull UploadEvidenceResponse> uploadEvidence(
            @PathVariable Long orderId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            Authentication auth
    ) throws IOException {
        UserEntity creator = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.uploadEvidence(orderId, description, file, creator));
    }

    @GetMapping("/{orderId}/timeline")
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN') or hasAuthority('ROLE_EMPLOYEE') or hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<@NonNull TimelineResponse> getTimeline(
            @Valid @PathVariable Long orderId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.getTimeline(orderId, admin));
    }

    @GetMapping("/{orderId}/close")
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
    public ResponseEntity<@NonNull CloseOrderResponse> closeOrder(@PathVariable Long orderId, Authentication auth) {
        UserEntity creator = (UserEntity) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.OK).body(orderService.closeOrder(orderId, creator));
    }
}
