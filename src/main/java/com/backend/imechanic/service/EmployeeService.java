package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.EmployeeRequest;
import com.backend.imechanic.controller.response.EmployeeResponse;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.exception.AccessDeniedException;
import com.backend.imechanic.model.Employee;
import com.backend.imechanic.model.Profile;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.EmployeeRepository;
import com.backend.imechanic.repository.ProfileRepository;
import com.backend.imechanic.repository.UserRepository;
import com.backend.imechanic.repository.WorkshopRepository;
import com.backend.imechanic.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkshopRepository workshopRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public EmployeeResponse create(EmployeeRequest request, UserEntity admin) {

        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workshop not found"));

        // build new user
        UserEntity newUser = UserEntity.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .isAccountNonExpired(true)
                .isAccountNonLocked(true)
                .isCredentialsNonExpired(true)
                .isEnabled(true)
                .role(Role.ROLE_EMPLOYEE)
                .build();

        Profile newProfile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        newUser.setProfile(newProfile);
        userRepository.save(newUser);

        // build employee
        Employee newEmployee = Employee.builder()
                .user(newUser)
                .workshop(workshop)
                .build();

        employeeRepository.save(newEmployee);

        return new EmployeeResponse(newProfile.getFirstName(), newProfile.getLastName(), newProfile.getPhone(), newUser.isEnabled());
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployee(Long employeeId, UserEntity admin) {

        Employee employee = verifyOwnerShip(employeeId, admin);

        Profile profile = employee.getUser().getProfile();

        return new EmployeeResponse(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone(),
                employee.getUser().isEnabled()
        );
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployees(UserEntity admin) {

        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        return employeeRepository.findAllByWorkshopIdWithUserAndProfile(workshop.getId()).stream()
                .map(
                        employee -> {
                            Profile profile = employee.getUser().getProfile();

                            return new EmployeeResponse(
                                    profile.getFirstName(),
                                    profile.getLastName(),
                                    profile.getPhone(),
                                    employee.getUser().isEnabled()
                            );
                        }
                ).toList();
    }

    @Transactional
    public EmployeeResponse update(Long employeeId, EmployeeRequest updatedEmployee, UserEntity admin) {

        Employee employeeFound = verifyOwnerShip(employeeId, admin);

        UserEntity user = employeeFound.getUser();
        user.setEmail(updatedEmployee.email());
        user.setPassword(passwordEncoder.encode(updatedEmployee.password()));

        userRepository.save(user);

        Profile profile = user.getProfile();
        profile.setFirstName(updatedEmployee.firstName());
        profile.setLastName(updatedEmployee.lastName());
        profile.setPhone(updatedEmployee.phone());

        profileRepository.save(profile);

        return new EmployeeResponse(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone(),
                user.isEnabled()
        );
    }

    @Transactional
    public String enableAndDisableEmployee(Long employeeId, UserEntity admin) {

        Employee employeeFound = verifyOwnerShip(employeeId, admin);

        boolean enable = !employeeFound.getUser().isEnabled();
        employeeFound.getUser().setEnabled(enable);

        return enable
                ? "Employee with ID: " + employeeFound.getId() + " available"
                : "Employee with ID: " + employeeFound.getId() + " not available";
    }

    @Transactional
    public void delete(Long employeeId, UserEntity admin) {
        Employee employee = verifyOwnerShip(employeeId, admin);
        UserEntity user = employee.getUser();

        employeeRepository.delete(employee);
        userRepository.delete(user);
    }

    private Employee verifyOwnerShip(Long employeeId, UserEntity admin) {
        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found for admin"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        if (!employee.getWorkshop().getId().equals(workshop.getId()))
            throw new AccessDeniedException("Not your workshop");

        return employee;
    }

}
