package com.backend.imechanic.repository;

import com.backend.imechanic.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity save(UserEntity user);

    Optional<UserEntity> findByEmail(String email);
}
