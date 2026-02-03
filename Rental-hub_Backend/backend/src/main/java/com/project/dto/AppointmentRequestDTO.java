package com.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequestDTO {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    private Long ownerId;  // optional
    
    private Long agentId;  // optional
}
