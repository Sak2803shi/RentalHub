package com.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.LeaseAgreementRequestDTO;
import com.project.dto.LeaseAgreementResponseDTO;
import com.project.service.LeaseAgreementService;

@RestController
@RequestMapping("/api/leases")
public class LeaseAgreementController {

    private final LeaseAgreementService leaseService;

    public LeaseAgreementController(LeaseAgreementService leaseService) {
        this.leaseService = leaseService;
    }

    @PostMapping
    public ResponseEntity<LeaseAgreementResponseDTO> createLease(@RequestBody LeaseAgreementRequestDTO dto) {
        return ResponseEntity.ok(leaseService.createLease(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaseAgreementResponseDTO> getLeaseById(@PathVariable Long id) {
        return ResponseEntity.ok(leaseService.getLeaseById(id));
    }

    @GetMapping
    public ResponseEntity<List<LeaseAgreementResponseDTO>> getAllLeases() {
        return ResponseEntity.ok(leaseService.getAllLeases());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LeaseAgreementResponseDTO>> getLeasesByCustomerId(@PathVariable Long customerId) {
        List<LeaseAgreementResponseDTO> leases = leaseService.getLeasesByCustomerId(customerId);
        return ResponseEntity.ok(leases);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaseAgreementResponseDTO> updateLease(
            @PathVariable Long id,
            @RequestBody LeaseAgreementRequestDTO dto) {
        return ResponseEntity.ok(leaseService.updateLease(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLease(@PathVariable Long id) {
        leaseService.deleteLease(id);
        return ResponseEntity.noContent().build();
    }
}
