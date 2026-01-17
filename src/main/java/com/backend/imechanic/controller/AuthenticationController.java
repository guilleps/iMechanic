package com.backend.imechanic.controller;

import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.request.LoginRequest;
import com.backend.imechanic.controller.request.WorkshopRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.controller.response.LoginResponse;
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

    @PostMapping("/verify-account")
    public ResponseEntity<String> verifyAccount(@RequestParam String token) {
        String response = userService.verifyAccount(token);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
