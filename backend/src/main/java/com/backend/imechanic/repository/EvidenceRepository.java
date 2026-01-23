package com.backend.imechanic.repository;

import com.backend.imechanic.model.Evidence;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvidenceRepository extends JpaRepository<@NonNull Evidence, @NonNull Long> {
}
