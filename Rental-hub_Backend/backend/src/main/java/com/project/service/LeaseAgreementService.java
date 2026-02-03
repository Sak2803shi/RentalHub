package com.project.service;

import java.util.List;
import com.project.dto.LeaseAgreementRequestDTO;
import com.project.dto.LeaseAgreementResponseDTO;

public interface LeaseAgreementService {

    LeaseAgreementResponseDTO createLease(LeaseAgreementRequestDTO dto);

    LeaseAgreementResponseDTO getLeaseById(Long leaseId);

    List<LeaseAgreementResponseDTO> getAllLeases();

    LeaseAgreementResponseDTO updateLease(Long leaseId, LeaseAgreementRequestDTO dto);
    List<LeaseAgreementResponseDTO> getLeasesByCustomerId(Long customerId);

    String deleteLease(Long leaseId);
}
