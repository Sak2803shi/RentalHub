package com.project.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "properties")
@AllArgsConstructor
@NoArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long propertyId;

    // -----------------------------
    // Property Details
    // -----------------------------

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    @Column(nullable = false)
    private String description;

    @NotBlank(message = "Address cannot be blank")
    @Size(min = 5, max = 255, message = "Address must be between 5 and 255 characters")
    @Column(nullable = false)
    private String address;

    @NotNull(message = "Rent amount is required")
    @DecimalMin(value = "1.0", message = "Rent amount must be greater than 0")
    @Column(nullable = false)
    private Double rentAmount;

    @NotBlank(message = "Property type is required")
    @Column(nullable = false)
    private String propertyType;

    @NotNull(message = "Availability status is required")
    @Column(nullable = false)
    private Boolean isAvailable;

    // -----------------------------
    // Metadata
    // -----------------------------

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime created_at;

    // -----------------------------
    // Relationships
    // -----------------------------

    @NotNull(message = "Owner is mandatory")
    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @ManyToOne(optional = true)
    @JoinColumn(name = "agent_id", nullable = true)
    private Agent agent;

}
