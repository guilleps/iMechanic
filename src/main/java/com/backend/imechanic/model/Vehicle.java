package com.backend.imechanic.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vehicles")
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String plate;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private boolean active;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name="customer_id", nullable = false)
    private UserEntity customer;
}
