package com.paymentdemo.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private Long leaseId;
    private Long customerUserId;  // ID from User Service
    private Long ownerUserId;     // ID from User Service

    private Double amount;
    private String paymentMethod;
    private String status;

    @CreationTimestamp
    private LocalDateTime paymentDate;
}
