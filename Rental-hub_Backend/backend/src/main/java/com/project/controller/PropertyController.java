package com.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.PropertyRequestDTO;
import com.project.dto.PropertyResponseDTO;
import com.project.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> addProperty(@RequestBody PropertyRequestDTO dto) {
        return ResponseEntity.ok(propertyService.addProperty(dto));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
    
    

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequestDTO dto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property deleted successfully");
    }

    @GetMapping("/available")
    public ResponseEntity<List<PropertyResponseDTO>> getAvailable() {
        return ResponseEntity.ok(propertyService.getAvailableProperties());
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<PropertyResponseDTO> changeAvailability(
            @PathVariable Long id,
            @RequestParam Boolean status) {
        return ResponseEntity.ok(propertyService.markPropertyAvailability(id, status));
    }
}
