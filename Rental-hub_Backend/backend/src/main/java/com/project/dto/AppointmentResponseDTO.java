package com.project.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentResponseDTO {

    private Long appointmentId;

    private Long customerId;
    private String customerName;

    private Long propertyId;
    private String propertyTitle;

    private String handledBy;   // OWNER / AGENT
    private String handlerName;

    private LocalDateTime createdAt;
}
