package com.paymentdemo.external.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaseAgreementDTO {

    private Long leaseId;
    private Long propertyId;
    private Double rentAmount;
    private String status;   // ACTIVE, CLOSED, etc.

}
