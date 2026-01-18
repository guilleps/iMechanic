package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.EmployeeRequest;
import com.backend.imechanic.controller.response.EmployeeResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.EmployeeService;
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
@RequestMapping("/api/v1/employees")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<@NonNull EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request,
                                                            Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request, admin));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<@NonNull EmployeeResponse> getOne(@PathVariable Long employeeId,
                                                            Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(employeeService.getEmployee(employeeId, admin));
    }

    @GetMapping
    public ResponseEntity<@NonNull List<EmployeeResponse>> getAll(Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(employeeService.getEmployees(admin));
    }

    @PatchMapping("/{employeeId}")
    public ResponseEntity<@NonNull EmployeeResponse> update(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeRequest request,
            Authentication auth
    ) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(employeeService.update(employeeId, request, admin));
    }

    @PatchMapping("/{employeeId}/availability")
    public ResponseEntity<@NonNull String> notAvailableEmployee(@PathVariable Long employeeId, Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity.ok(employeeService.enableAndDisableEmployee(employeeId, admin));
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<@NonNull String> delete(@PathVariable Long employeeId, Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();
        employeeService.delete(employeeId, admin);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
