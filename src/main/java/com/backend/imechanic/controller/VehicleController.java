package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.VehicleRequest;
import com.backend.imechanic.controller.response.VehicleResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.VehicleService;
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
@RequestMapping("/api/v1/vehicles")
@PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<@NonNull VehicleResponse> create(
            @Valid @RequestBody VehicleRequest request,
            Authentication auth
    ) {
        UserEntity customer = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vehicleService.create(request, customer));
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<@NonNull VehicleResponse> getOne(
            @PathVariable Long vehicleId,
            Authentication auth
    ) {
        UserEntity customer = (UserEntity) auth.getPrincipal();

        return ResponseEntity.ok(vehicleService.getVehicle(vehicleId, customer));
    }

    @GetMapping
    public ResponseEntity<@NonNull List<VehicleResponse>> getAll(Authentication auth) {
        UserEntity customer = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(vehicleService.getAllVehiclesByCustomer(customer));
    }

    @PatchMapping("/{vehicleId}")
    public ResponseEntity<@NonNull VehicleResponse> update(
            @PathVariable Long vehicleId,
            @Valid @RequestBody VehicleRequest request,
            Authentication auth
    ) {
        UserEntity customer = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(vehicleService.update(vehicleId, request, customer));
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<@NonNull Void> delete(@PathVariable Long vehicleId, Authentication auth) {
        UserEntity customer = (UserEntity) auth.getPrincipal();
        vehicleService.delete(vehicleId, customer);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
