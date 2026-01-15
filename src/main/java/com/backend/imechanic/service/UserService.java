package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.CustomerRequest;
import com.backend.imechanic.controller.request.WorkshopRequest;
import com.backend.imechanic.controller.response.CustomerResponse;
import com.backend.imechanic.controller.response.WorkshopResponse;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.UserRepository;
import com.backend.imechanic.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final WorkshopRepository workshopRepository;

    public CustomerResponse saveUser(CustomerRequest request) {

        Profile newProfile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        UserEntity newUser = UserEntity.builder()
                .email(request.email())
                .password(request.password())
                .enabled(true)
                .profile(newProfile)
                .build();

        newProfile.setUser(newUser);
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
                .password(request.password())
                .enabled(true)
                .profile(newProfile)
                .workshop(newWorkshop)
                .build();

        newProfile.setUser(newUser);
        newWorkshop.setUser(newUser);

        userRepository.save(newUser);

        return new WorkshopResponse("Workshop and Admin account created successfully.", newWorkshop.getId(), newUser.getId());
    }
}
