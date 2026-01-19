package com.backend.imechanic.service;

import com.backend.imechanic.controller.response.AssignmentResponse;
import com.backend.imechanic.controller.response.EmployeeWithServiceResponse;
import com.backend.imechanic.controller.response.ServiceResponse;
import com.backend.imechanic.exception.AccessDeniedException;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.model.Catalog;
import com.backend.imechanic.model.Employee;
import com.backend.imechanic.model.EmployeeCatalogAssignment;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.repository.CatalogRepository;
import com.backend.imechanic.repository.EmployeeCatalogAssignmentRepository;
import com.backend.imechanic.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeCatalogAssignmentService {
    private final EmployeeRepository employeeRepository;
    private final CatalogRepository catalogRepository;
    private final EmployeeCatalogAssignmentRepository assignmentRepository;

    @Transactional
    public AssignmentResponse assign(Long employeeId, Long serviceId, UserEntity admin) {
        Employee employee = employeeRepository.findByIdAndWorkshop_User_Id(employeeId, admin.getId())
                .orElseThrow(() -> new AccessDeniedException("Employee not found or not your workshop"));

        Catalog service = catalogRepository.findByIdAndWorkshop_User_Id(serviceId, admin.getId())
                .orElseThrow(() -> new AccessDeniedException("Service not found or not your workshop"));

        if (assignmentRepository.existsByEmployee_IdAndService_Id(employeeId, serviceId)) {
            throw new IllegalArgumentException("Service already assigned to employee");
        }

        EmployeeCatalogAssignment newAssignment = new EmployeeCatalogAssignment();
        newAssignment.setEmployee(employee);
        newAssignment.setService(service);

        assignmentRepository.save(newAssignment);

        return new AssignmentResponse(
                "Nueva asignacion: " + newAssignment.getEmployee().getUser().getProfile().getFirstName() + " <-> " + newAssignment.getService().getName()
        );
    }

    @Transactional
    public AssignmentResponse unassign(Long employeeId, Long serviceId, UserEntity admin) {

        employeeRepository.findByIdAndWorkshop_User_Id(employeeId, admin.getId())
                .orElseThrow(() -> new AccessDeniedException("Employee not found or not your workshop"));

        catalogRepository.findByIdAndWorkshop_User_Id(serviceId, admin.getId())
                .orElseThrow(() -> new AccessDeniedException("Service not found or not your workshop"));

        EmployeeCatalogAssignment newAssignment = assignmentRepository.findByEmployee_IdAndService_Id(employeeId, serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment does not exist"));

        assignmentRepository.delete(newAssignment);

        return new AssignmentResponse(
                "Se ha eliminado el servicio: " + newAssignment.getService().getName() + " <- " + newAssignment.getEmployee().getId()
        );
    }

    @Transactional(readOnly = true)
    public EmployeeWithServiceResponse getEmployeeWithServices(Long employeeId, UserEntity admin) {
        Employee employee = employeeRepository
                .findByIdAndWorkshop_User_Id(employeeId, admin.getId())
                .orElseThrow(() -> new AccessDeniedException("Employee not found or not your workshop"));

        List<EmployeeCatalogAssignment> assignments = assignmentRepository
                .findAllByEmployee_IdAndEmployee_Workshop_User_Id(employeeId, admin.getId());

        String fullName = employee.getUser().getProfile().getFirstName() + " " + employee.getUser().getProfile().getLastName();

        List<ServiceResponse> services = assignments.stream()
                .map(EmployeeCatalogAssignment::getService)
                .distinct()
                .map(s -> new ServiceResponse(
                        s.getName(),
                        s.getDescription(),
                        s.getCategory().toString(),
                        s.getBasePrice(),
                        s.isActive()
                ))
                .toList();

        return new EmployeeWithServiceResponse(fullName, services);
    }
}