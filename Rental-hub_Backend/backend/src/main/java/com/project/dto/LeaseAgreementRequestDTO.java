package com.project.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaseAgreementRequestDTO {
    private Long propertyId;
    private Long customerUserId;
    private Long ownerUserId;  // optional
    private LocalDate startDate;
    private LocalDate endDate;
    private Double monthlyRent;
    private Double securityDeposit;
    private Boolean isSigned;

    
}