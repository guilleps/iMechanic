package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.VehicleRequest;
import com.backend.imechanic.controller.response.VehicleResponse;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.exception.IllegalArgumentException;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Vehicle;
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

    @Transactional
    public VehicleResponse create(VehicleRequest request, UserEntity customer) {

        UserEntity user = userRepository.findById(customer.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        Vehicle vehicle = Vehicle.builder()
                .plate(request.plate())
                .model(request.model())
                .brand(request.brand())
                .year(request.year())
                .active(true)
                .customer(user)
                .build();

        vehicleRepository.save(vehicle);

        return new VehicleResponse(
                user.getId().toString(),
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear()
        );
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicle(Long vehicleId, UserEntity customer) {

        UserEntity user = userRepository.findById(customer.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        Vehicle vehicle = vehicleRepository
                .findVehicleByIdAndCustomer_Id(vehicleId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        return new VehicleResponse(
                user.getId().toString(),
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear()
        );
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehiclesByCustomer(UserEntity customer) {

        UserEntity user = userRepository.findById(customer.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        return vehicleRepository
                .findAllByCustomer_Id(user.getId())
                .stream()
                .filter(Vehicle::isActive)
                .map(vehicle ->
                        new VehicleResponse(
                                user.getId().toString(),
                                vehicle.getPlate(),
                                vehicle.getModel(),
                                vehicle.getBrand(),
                                vehicle.getYear()
                        )
                ).toList();
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleByPlate(String plate) {

        Vehicle vehicle = vehicleRepository
                .findVehicleByPlate(plate)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        return new VehicleResponse(
                vehicle.getCustomer().getId().toString(),
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear()
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

        return new VehicleResponse(
                customer.getId().toString(),
                vehicle.getPlate(),
                vehicle.getModel(),
                vehicle.getBrand(),
                vehicle.getYear()
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
