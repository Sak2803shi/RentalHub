package com.project.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyResponseDTO {

    private Long propertyId;
    private String title;
    private String description;
    private String address;
    private Double rentAmount;
    private String propertyType;
    private Boolean isAvailable;

    private Long ownerId;
    private String ownerName;

    private Long agentId;
    private String agentName;

    
}
