package com.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyRequestDTO {

    private String title;
    private String description;
    private String address;
    private Double rentAmount;
    private String propertyType;
    private Boolean isAvailable;

    private Long ownerId;
    private Long agentId; // optional
}
