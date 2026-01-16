package com.backend.imechanic.controller;

import com.backend.imechanic.config.auth.JWT.JwtService;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> signupWorkshop(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            LoginResponse response = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
