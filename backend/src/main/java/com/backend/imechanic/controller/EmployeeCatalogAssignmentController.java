package com.backend.imechanic.controller;

import com.backend.imechanic.controller.response.AssignmentResponse;
import com.backend.imechanic.controller.response.EmployeeWithServiceResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.EmployeeCatalogAssignmentService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employees/{employeeId}/services")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
@RequiredArgsConstructor
public class EmployeeCatalogAssignmentController {
    private final EmployeeCatalogAssignmentService assignmentService;

    @PostMapping("/{serviceId}")
    public ResponseEntity<@NonNull AssignmentResponse> assign(
            @PathVariable Long employeeId,
            @PathVariable Long serviceId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(assignmentService.assign(employeeId, serviceId, admin));
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<@NonNull AssignmentResponse> unassign(
            @PathVariable Long employeeId,
            @PathVariable Long serviceId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(assignmentService.unassign(employeeId, serviceId, admin));
    }

    @GetMapping
    public ResponseEntity<@NonNull EmployeeWithServiceResponse> getEmployeeServices(
            @PathVariable Long employeeId,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(
                assignmentService.getEmployeeWithServices(employeeId, admin)
        );
    }
}
