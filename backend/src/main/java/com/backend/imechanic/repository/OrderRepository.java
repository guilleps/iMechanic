package com.backend.imechanic.repository;

import com.backend.imechanic.model.Order;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<@NonNull Order, @NonNull Long> {

    Optional<Order> findOrderByIdAndWorkshop_Id(Long orderId, Long workshopId);

    Optional<Order> findOrderByIdAndWorkshop_User_Id(Long orderId, Long userId);

    Optional<Order> findOrderByIdAndVehicle_Customer_Id(Long orderId, Long vehicleCustomerId);

    @Query("select o from Order o where o.id = :orderId " +
            "and exists (select 1 from Item i where i.order = o and i.employee.user.id = :userId)")
    Optional<Order> findOrderVisibleToEmployee(@Param("orderId") Long orderId,
                                               @Param("userId") Long userId);
}