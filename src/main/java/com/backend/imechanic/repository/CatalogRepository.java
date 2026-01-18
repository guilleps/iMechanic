package com.backend.imechanic.repository;

import com.backend.imechanic.model.Catalog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CatalogRepository extends JpaRepository<Catalog, Long> {

    List<Catalog> findAllByWorkshop_User_IdOrderByCreatedAtDesc(Long userId);

    Optional<Catalog> findByIdAndWorkshop_User_Id(Long serviceId, Long userId);
}
