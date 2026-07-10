package com.backend.imechanic.controller;

import com.backend.imechanic.controller.response.DashboardResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.WorkshopService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workshops")
@PreAuthorize("hasAuthority('ROLE_WORKSHOP_ADMIN')")
@RequiredArgsConstructor
public class WorkshopController {
    private final WorkshopService workshopService;

    @GetMapping("/dashboard")
    public ResponseEntity<@NonNull DashboardResponse> getDashboard(Authentication auth) {
        UserEntity admin = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(workshopService.getDashboard(admin));
    }
}
