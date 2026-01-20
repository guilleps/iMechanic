package com.backend.imechanic.repository;

import com.backend.imechanic.model.Item;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<@NonNull Item, @NonNull Long> {
}
