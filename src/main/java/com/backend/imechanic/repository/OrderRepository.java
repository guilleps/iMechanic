package com.backend.imechanic.repository;

import com.backend.imechanic.model.Order;
import com.backend.imechanic.model.Workshop;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<@NonNull Order, @NonNull Long> {

    Optional<Order> findOrderByIdAndWorkshop_Id(Long orderId, Long workshopId);
}
