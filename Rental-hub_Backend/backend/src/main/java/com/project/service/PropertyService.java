package com.project.service;

import java.util.List;
import com.project.dto.PropertyRequestDTO;
import com.project.dto.PropertyResponseDTO;

public interface PropertyService {

    PropertyResponseDTO addProperty(PropertyRequestDTO dto);

    List<PropertyResponseDTO> getAllProperties();

    PropertyResponseDTO getPropertyById(Long id);

    PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto);

    String deleteProperty(Long id);

    
    List<PropertyResponseDTO> getAvailableProperties();

    List<PropertyResponseDTO> getPropertiesByOwner(Long ownerId);

    List<PropertyResponseDTO> getPropertiesByAgent(Long agentId);

    PropertyResponseDTO markPropertyAvailability(Long id, Boolean status);
}
