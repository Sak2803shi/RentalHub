package com.project.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lease_agreements")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LeaseAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaseId;

    // Property being leased
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    // Customer renting the property
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Lease handled by owner (optional)
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double monthlyRent;
    private Double securityDeposit;
    private Boolean isSigned;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

