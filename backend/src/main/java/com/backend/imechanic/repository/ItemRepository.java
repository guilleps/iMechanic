package com.backend.imechanic.repository;

import com.backend.imechanic.model.Item;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<@NonNull Item, @NonNull Long> {

    Optional<Item> findByIdAndOrder_IdAndOrder_Workshop_IdAndEmployee_Id(Long itemId, Long orderId, Long workshopId, Long employeeId);
}
