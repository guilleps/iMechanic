package com.backend.imechanic.repository;

import com.backend.imechanic.model.Profile;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<@NonNull Profile, @NonNull Long> {
}
