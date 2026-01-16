package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.request.WorkshopRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public CustomerResponse saveUser(CustomerRequest request) {

        Profile newProfile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        UserEntity newUser = UserEntity.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .role(Role.ROLE_CUSTOMER)
                .build();

        newProfile.setUser(newUser);
        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        return new CustomerResponse(newUser.getEmail(), newProfile.getFirstName(), newProfile.getLastName(), newProfile.getPhone());
    }

    public WorkshopResponse saveWorkshop(WorkshopRequest request) {

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
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .profile(newProfile)
                .workshop(newWorkshop)
                .role(Role.ROLE_WORKSHOP_ADMIN)
                .build();

        newProfile.setUser(newUser);
        newWorkshop.setUser(newUser);

        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        return new WorkshopResponse("Workshop and Admin account created successfully.", newWorkshop.getId(), newUser.getId());
    }
}
