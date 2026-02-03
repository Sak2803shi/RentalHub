package com.project.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CustomerDashboardDTO {
    private CustomerResponseDTO profile;
    private List<AppointmentResponseDTO> appointments;
    private List<LeaseAgreementResponseDTO> leases;
    private List<PropertyResponseDTO> properties;

    
}
