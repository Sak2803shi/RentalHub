package com.project.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entities.LeaseAgreement;

public interface LeaseAgreementRepository extends JpaRepository<LeaseAgreement, Long> {

    List<LeaseAgreement> findByCustomerUserId(Long userId);  // ✅ CORRECT
    
}
