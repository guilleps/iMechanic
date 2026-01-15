package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.request.WorkshopRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.service.UserService;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;

    @PostMapping("/signup/customer")
    public ResponseEntity<@NonNull CustomerResponse> signupCustomer(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse customerResponse = userService.saveUser(request);
        return ResponseEntity.status(HttpStatus.OK).body(customerResponse);
    }

    @PostMapping("/signup/workshop")
    public ResponseEntity<@NonNull WorkshopResponse> signupWorkshop(@Valid @RequestBody WorkshopRequest request) {
        WorkshopResponse workshopResponse = userService.saveWorkshop(request);
        return ResponseEntity.status(HttpStatus.OK).body(workshopResponse);
    }
}
