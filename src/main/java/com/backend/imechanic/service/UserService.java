package com.backend.imechanic.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.backend.imechanic.config.auth.JWT.JwtService;
import com.backend.imechanic.config.email.EmailService;
import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.request.LoginRequest;
import com.backend.imechanic.controller.request.WorkshopRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.controller.response.LoginResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.exception.EmailAlreadyRegisteredException;
import com.backend.imechanic.exception.InvalidVerificationTokenException;
import com.backend.imechanic.exception.UserNotFoundException;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public CustomerResponse saveUser(CustomerRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(request.email())) {
            log.info("Signup rejected: email already registered (email={})", email);
            throw new EmailAlreadyRegisteredException(email);
        }

        Profile newProfile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        UserEntity newUser = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(false)
                .role(Role.ROLE_CUSTOMER)
                .build();

        newProfile.setUser(newUser);
        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        String token = jwtService.generateVerifyToken(newUser.getEmail());
        emailService.sendVerifyAccountEmail(newUser.getEmail(), token);

        return new CustomerResponse(newUser.getEmail(), newProfile.getFirstName(), newProfile.getLastName(), newProfile.getPhone());
    }

    public WorkshopResponse saveWorkshop(WorkshopRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException(email);
        }

        Profile newProfile = Profile.builder()
                .firstName(request.ownerName())
                .lastName(request.ownerName())
                .phone(request.phone())
                .build();

        Workshop newWorkshop = Workshop.builder()
                .name(request.workshopName())
                .addres(request.address())
                .phone(request.phone())
                .build();

        UserEntity newUser = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(false)
                .profile(newProfile)
                .workshop(newWorkshop)
                .role(Role.ROLE_WORKSHOP_ADMIN)
                .build();

        newProfile.setUser(newUser);
        newWorkshop.setUser(newUser);

        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        String token = jwtService.generateVerifyToken(newUser.getEmail());
        emailService.sendVerifyAccountEmail(newUser.getEmail(), token);

        return new WorkshopResponse("Workshop and Admin account created successfully.", newWorkshop.getId(), newUser.getId());
    }

    @Transactional
    public String verifyAccount(String token) {

        DecodedJWT jwt = jwtService.verifyAndAssertType(token, "verify");

        String email = jwt.getSubject();
        if (email == null || email.isBlank()) {
            throw new InvalidVerificationTokenException("Token sin subject");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (user.isEnabled()) return "User already verified";

        user.setEnabled(true);
        return "Verified user";
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return jwtService.generateToken(userDetails);
    }
}
