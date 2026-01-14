package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public CustomerResponse saveUser(CustomerRequest request) {

        Profile newProfile = new Profile();
        newProfile.setFirstName(request.firstName());
        newProfile.setLastName(request.lastName());
        newProfile.setPhone(request.phone());

        UserEntity newUser = new UserEntity();
        newUser.setEmail(request.email());
        newUser.setPassword(request.password());
        newUser.setEnabled(true);

        newUser.setProfile(newProfile);
        newProfile.setUser(newUser);

        userRepository.save(newUser);

        return new CustomerResponse(newUser.getEmail(), newUser.getPassword(), newProfile.getFirstName(), newProfile.getLastName(), newProfile.getPhone());
    }
}
