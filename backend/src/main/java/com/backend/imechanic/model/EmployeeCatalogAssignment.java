package com.backend.imechanic.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity()
@Table(
        name = "employee_catalog_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "service_id"})
)
public class EmployeeCatalogAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Catalog service;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
