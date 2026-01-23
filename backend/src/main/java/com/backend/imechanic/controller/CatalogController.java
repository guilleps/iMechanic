package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.ServiceRequest;
import com.backend.imechanic.controller.response.ServiceResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.CatalogService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
@RequiredArgsConstructor
public class CatalogController {
    private final CatalogService catalogService;

    @PostMapping
    public ResponseEntity<@NonNull ServiceResponse> create(
            @Valid @RequestBody ServiceRequest request,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.create(request, admin));
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<@NonNull ServiceResponse> getOne(
            @PathVariable Long serviceId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(catalogService.getService(serviceId, admin));
    }

    @GetMapping
    public ResponseEntity<@NonNull List<ServiceResponse>> getAll(Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(catalogService.getAllServicesByWorkshop(admin));
    }

    @PatchMapping("/{serviceId}")
    public ResponseEntity<@NonNull ServiceResponse> update(
            @PathVariable Long serviceId,
            @Valid @RequestBody ServiceRequest request,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(catalogService.update(serviceId, request, admin));
    }

    @PatchMapping("/{serviceId}/availability")
    public ResponseEntity<@NonNull String> notAvailableEmployee(
            @PathVariable Long serviceId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity.ok(catalogService.toggleAvailability(serviceId, admin));
    }
}
