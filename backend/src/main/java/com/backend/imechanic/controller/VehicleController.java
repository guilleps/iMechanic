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
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
    public ResponseEntity<@NonNull VehicleResponse> create(@Valid @RequestBody VehicleRequest request, Authentication auth) {
        UserEntity customer = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vehicleService.create(request, customer));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
    public ResponseEntity<@NonNull List<VehicleResponse>> getAll(Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(vehicleService.getAllVehicles(admin));
    }

    @PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
    @GetMapping("/search/{plate}")
    public ResponseEntity<@NonNull VehicleResponse> getByVehiclePlate(@PathVariable String plate) {

        return ResponseEntity.ok(vehicleService.getVehicleByPlate(plate));
    }

    @PatchMapping("/{vehicleId}")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
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
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<@NonNull Void> delete(@PathVariable Long vehicleId, Authentication auth) {
        UserEntity customer = (UserEntity) auth.getPrincipal();
        vehicleService.delete(vehicleId, customer);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
