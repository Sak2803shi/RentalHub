package com.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.LeaseAgreementRequestDTO;
import com.project.dto.LeaseAgreementResponseDTO;
import com.project.entities.Customer;
import com.project.entities.LeaseAgreement;
import com.project.entities.Owner;
import com.project.entities.Property;
import com.project.repository.CustomerRepository;
import com.project.repository.LeaseAgreementRepository;
import com.project.repository.OwnerRepository;
import com.project.repository.PropertyRepository;

@Service
@Transactional
public class LeaseAgreementServiceImpl implements LeaseAgreementService {

    private final LeaseAgreementRepository leaseRepo;
    private final PropertyRepository propertyRepo;
    private final CustomerRepository customerRepo;
    private final OwnerRepository ownerRepo;

    public LeaseAgreementServiceImpl(
            LeaseAgreementRepository leaseRepo,
            PropertyRepository propertyRepo,
            CustomerRepository customerRepo,
            OwnerRepository ownerRepo) {
        this.leaseRepo = leaseRepo;
        this.propertyRepo = propertyRepo;
        this.customerRepo = customerRepo;
        this.ownerRepo = ownerRepo;
    }

    @Override
    public LeaseAgreementResponseDTO createLease(LeaseAgreementRequestDTO dto) {
        Property property = propertyRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Customer customer = customerRepo.findById(dto.getCustomerUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Owner owner = null;
        if (dto.getOwnerUserId() != null) {
            owner = ownerRepo.findById(dto.getOwnerUserId())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
        }

        LeaseAgreement lease = new LeaseAgreement();
        lease.setProperty(property);
        lease.setCustomer(customer);
        lease.setOwner(owner);
        lease.setStartDate(dto.getStartDate());
        lease.setEndDate(dto.getEndDate());
        lease.setMonthlyRent(dto.getMonthlyRent());
        lease.setSecurityDeposit(dto.getSecurityDeposit());
        lease.setIsSigned(dto.getIsSigned());

        LeaseAgreement saved = leaseRepo.save(lease);
        return mapToDTO(saved);
    }

    @Override
    public LeaseAgreementResponseDTO getLeaseById(Long leaseId) {
        LeaseAgreement lease = leaseRepo.findById(leaseId)
                .orElseThrow(() -> new RuntimeException("Lease not found"));
        return mapToDTO(lease);
    }

    @Override
    public List<LeaseAgreementResponseDTO> getAllLeases() {
        return leaseRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LeaseAgreementResponseDTO updateLease(Long leaseId, LeaseAgreementRequestDTO dto) {
        LeaseAgreement lease = leaseRepo.findById(leaseId)
                .orElseThrow(() -> new RuntimeException("Lease not found"));

        Property property = propertyRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Customer customer = customerRepo.findById(dto.getCustomerUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        lease.setProperty(property);
        lease.setCustomer(customer);

        if (dto.getOwnerUserId() != null) {
            Owner owner = ownerRepo.findById(dto.getOwnerUserId())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            lease.setOwner(owner);
        } else {
            lease.setOwner(null);
        }

        lease.setStartDate(dto.getStartDate());
        lease.setEndDate(dto.getEndDate());
        lease.setMonthlyRent(dto.getMonthlyRent());
        lease.setSecurityDeposit(dto.getSecurityDeposit());
        lease.setIsSigned(dto.getIsSigned());

        LeaseAgreement updated = leaseRepo.save(lease);
        return mapToDTO(updated);
    }

    @Override
    public String deleteLease(Long leaseId) {
        leaseRepo.deleteById(leaseId);
        return "lease agreement deleted";
    }

    @Override
    public List<LeaseAgreementResponseDTO> getLeasesByCustomerId(Long customerId) {
        return leaseRepo.findByCustomerUserId(customerId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    private LeaseAgreementResponseDTO mapToDTO(LeaseAgreement lease) {
        LeaseAgreementResponseDTO dto = new LeaseAgreementResponseDTO();
        dto.setLeaseId(lease.getLeaseId());
        dto.setPropertyId(lease.getProperty().getPropertyId());
        dto.setCustomerUserId(lease.getCustomer().getUserId());
        dto.setOwnerUserId(lease.getOwner() != null ? lease.getOwner().getUserId() : null);
        dto.setStartDate(lease.getStartDate());
        dto.setEndDate(lease.getEndDate());
        dto.setMonthlyRent(lease.getMonthlyRent());
        dto.setSecurityDeposit(lease.getSecurityDeposit());
        dto.setIsSigned(lease.getIsSigned());
        dto.setCreatedAt(lease.getCreatedAt());
        return dto;
    }
}
