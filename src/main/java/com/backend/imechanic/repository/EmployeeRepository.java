package com.backend.imechanic.repository;

import com.backend.imechanic.model.Employee;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<@NonNull Employee, @NonNull Long> {

    @Query("select e from Employee e " +
            "join fetch e.user u join fetch u.profile p " +
            "where e.workshop.id = :workshopId")
    List<Employee> findAllByWorkshopIdWithUserAndProfile(@Param("workshopId") Long workshopId);

    Optional<Employee> findByIdAndWorkshop_User_Id(Long employeeId, Long workshopId);
}
