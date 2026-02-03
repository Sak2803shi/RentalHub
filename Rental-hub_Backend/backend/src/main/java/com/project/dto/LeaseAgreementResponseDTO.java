// LeaseAgreementResponseDTO.java
package com.project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaseAgreementResponseDTO {
    private Long leaseId;
    private Long propertyId;
    private Long customerUserId;
    private Long ownerUserId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double monthlyRent;
    private Double securityDeposit;
    private Boolean isSigned;
    private LocalDateTime createdAt;

   
}
