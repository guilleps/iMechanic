package com.backend.imechanic.repository;

import com.backend.imechanic.model.Workshop;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkshopRepository extends JpaRepository<@NonNull Workshop, @NonNull Long> {

    Optional<Workshop> findByUserId(Long userId);
}
