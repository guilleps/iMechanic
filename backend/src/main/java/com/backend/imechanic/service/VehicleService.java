package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.VehicleRequest;
import com.backend.imechanic.controller.response.VehicleResponse;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.exception.IllegalArgumentException;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Vehicle;
import com.backend.imechanic.repository.ProfileRepository;
import com.backend.imechanic.repository.UserRepository;
import com.backend.imechanic.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public VehicleResponse create(VehicleRequest request, UserEntity admin) {

        UserEntity user = userRepository.findById(admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        UserEntity customer = UserEntity.builder()
                .role(Role.ROLE_CUSTOMER)
                .build();

        Profile profile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        customer.setProfile(profile);
        userRepository.save(customer);

        Vehicle vehicle = Vehicle.builder()
                .plate(request.plate())
                .model(request.model())
                .brand(request.brand())
                .year(request.year())
                .workshop(user.getWorkshop())
                .active(true)
                .customer(profile)
                .build();

        vehicleRepository.save(vehicle);

        return new VehicleResponse(
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone()
        );
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehicles(UserEntity admin) {

        return vehicleRepository
                .findAllByWorkshop_User_Id(admin.getId())
                .stream()
                .filter(Vehicle::isActive)
                .map(vehicle -> new VehicleResponse(
                        vehicle.getPlate(),
                        vehicle.getModel(),
                        vehicle.getBrand(),
                        vehicle.getYear(),
                        vehicle.getCustomer().getFirstName(),
                        vehicle.getCustomer().getLastName(),
                        vehicle.getCustomer().getPhone()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleByPlate(String plate) {

        Vehicle vehicle = vehicleRepository
                .findVehicleByPlate(plate)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        Profile profile = vehicle.getCustomer();

        return new VehicleResponse(
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone()
        );
    }

    @Transactional
    public VehicleResponse update(Long vehicleId, VehicleRequest request, UserEntity customer) {

        Vehicle vehicle = vehicleRepository
                .findVehicleByIdAndCustomer_Id(vehicleId, customer.getId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        if (!vehicle.isActive()) throw new IllegalArgumentException("Vehicle not exists");

        vehicle.setPlate(request.plate());
        vehicle.setModel(request.model());
        vehicle.setBrand(request.brand());
        vehicle.setYear(request.year());

        Profile profile = vehicle.getCustomer();

        return new VehicleResponse(
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone()
        );
    }

    @Transactional
    public void delete(Long vehicleId, UserEntity customer) {

        Vehicle vehicle = vehicleRepository
                .findVehicleByIdAndCustomer_Id(vehicleId, customer.getId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        vehicle.setActive(false);
    }

}
