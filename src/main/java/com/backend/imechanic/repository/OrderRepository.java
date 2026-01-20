package com.backend.imechanic.repository;

import com.backend.imechanic.model.Order;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<@NonNull Order, @NonNull Long> {
}
