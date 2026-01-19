package com.backend.imechanic.repository;

import com.backend.imechanic.model.EmployeeCatalogAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeCatalogAssignmentRepository extends JpaRepository<EmployeeCatalogAssignment, Long> {

    boolean existsByEmployee_IdAndService_Id(Long employeeId, Long serviceId);

    Optional<EmployeeCatalogAssignment> findByEmployee_IdAndService_Id(Long employeeId, Long serviceId);

    List<EmployeeCatalogAssignment> findAllByEmployee_IdAndEmployee_Workshop_User_Id(Long employeeId, Long adminUserId);

    List<EmployeeCatalogAssignment> findAllByEmployee_Id(Long employeeId);
}
