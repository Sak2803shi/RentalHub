package com.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.PropertyRequestDTO;
import com.project.dto.PropertyResponseDTO;
import com.project.entities.Agent;
import com.project.entities.Owner;
import com.project.entities.Property;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AgentRepository;
import com.project.repository.OwnerRepository;
import com.project.repository.PropertyRepository;

@Service
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final OwnerRepository ownerRepository;
    private final AgentRepository agentRepository;
    private final ModelMapper modelMapper;

    public PropertyServiceImpl(PropertyRepository propertyRepository,
                               OwnerRepository ownerRepository,
                               AgentRepository agentRepository,
                               ModelMapper modelMapper) {
        this.propertyRepository = propertyRepository;
        this.ownerRepository = ownerRepository;
        this.agentRepository = agentRepository;
        this.modelMapper = modelMapper;
    }

    // ================= ADD PROPERTY =================
    @Override
    public PropertyResponseDTO addProperty(PropertyRequestDTO dto) {

        Owner owner = ownerRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        validateOwnerOrAdmin(owner);   // 🔐 SECURITY CHECK

        Property property = modelMapper.map(dto, Property.class);
        property.setOwner(owner);

        if (dto.getAgentId() != null) {
            Agent agent = agentRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
            property.setAgent(agent);
        } else {
            property.setAgent(null); // Optional agent
        }

        return mapToResponse(propertyRepository.save(property));
    }

    // ================= GET ALL =================
    @Override
    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    @Override
    public PropertyResponseDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return mapToResponse(property);
    }

    // ================= UPDATE PROPERTY =================
    @Override
    public PropertyResponseDTO updateProperty(Long id, PropertyRequestDTO dto) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        validateOwnerOrAdmin(property.getOwner()); // 🔐 Only owner or admin can update

        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setAddress(dto.getAddress());
        property.setRentAmount(dto.getRentAmount());
        property.setPropertyType(dto.getPropertyType());
        property.setIsAvailable(dto.getIsAvailable());

        if (dto.getAgentId() != null) {
            Agent agent = agentRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
            property.setAgent(agent);
        } else {
            property.setAgent(null);
        }

        return mapToResponse(propertyRepository.save(property));
    }

    // ================= DELETE PROPERTY =================
    @Override
    public String deleteProperty(Long id) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        validateOwnerOrAdmin(property.getOwner()); // 🔐 Only owner or admin can delete

        propertyRepository.delete(property);
        return "Property deleted";
    }

    // ================= AVAILABLE =================
    @Override
    public List<PropertyResponseDTO> getAvailableProperties() {
        return propertyRepository.findByIsAvailableTrue()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

//    @Override
//    public List<PropertyResponseDTO> getAvailableProperties() {
//        return propertyRepo.findByIsAvailableTrue()
//                .stream()
//                .map(this::mapToDTO)
//                .toList();
//    }

    // ================= BY OWNER =================
    @Override
    public List<PropertyResponseDTO> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerUserId(ownerId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= BY AGENT =================
    @Override
    public List<PropertyResponseDTO> getPropertiesByAgent(Long agentId) {
        return propertyRepository.findByAgentUserId(agentId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= AVAILABILITY =================
    @Override
    public PropertyResponseDTO markPropertyAvailability(Long id, Boolean status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        validateOwnerOrAdmin(property.getOwner()); // 🔐 Only owner or admin can change availability

        property.setIsAvailable(status);
        return mapToResponse(propertyRepository.save(property));
    }

    // ================= OWNER OR ADMIN SECURITY CHECK =================
    private void validateOwnerOrAdmin(Owner owner) {
        String loggedInEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            // Admin can proceed without restriction
            return;
        }

        if (!owner.getEmail().equals(loggedInEmail)) {
            throw new RuntimeException("You can modify only your own properties!");
        }
    }

    // ================= DTO MAPPING =================
    private PropertyResponseDTO mapToResponse(Property property) {
        PropertyResponseDTO dto = modelMapper.map(property, PropertyResponseDTO.class);
        dto.setOwnerId(property.getOwner().getUserId());
        dto.setOwnerName(property.getOwner().getFirstName());

        if (property.getAgent() != null) {
            dto.setAgentId(property.getAgent().getUserId());
            dto.setAgentName(property.getAgent().getFirstName());
        }
        return dto;
    }
}
