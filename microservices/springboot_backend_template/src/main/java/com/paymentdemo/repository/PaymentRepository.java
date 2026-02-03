package com.paymentdemo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.paymentdemo.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByCustomerUserId(Long customerUserId);
    List<Payment> findByOwnerUserId(Long ownerUserId);
}
