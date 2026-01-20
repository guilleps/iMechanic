package com.backend.imechanic.repository;

import com.backend.imechanic.model.Vehicle;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<@NonNull Vehicle, @NonNull Long> {

    Optional<Vehicle> findVehicleByIdAndCustomer_Id(Long id, Long customerId);

    List<Vehicle> findAllByCustomer_Id(Long customerId);

    Optional<Vehicle> findVehicleByPlate(String plate);
}
