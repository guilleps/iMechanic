package com.backend.imechanic.repository;

import com.backend.imechanic.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
