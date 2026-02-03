package com.paymentdemo.service;

import java.util.List;

import com.paymentdemo.dto.PaymentRequestDTO;
import com.paymentdemo.dto.PaymentResponseDTO;

public interface PaymentService {

    // Create new payment
    PaymentResponseDTO createPayment(PaymentRequestDTO dto);

    // Get payment by ID
    PaymentResponseDTO getPaymentById(Long paymentId);

    // Get all payments
    List<PaymentResponseDTO> getAllPayments();

    // Payments of one customer
    List<PaymentResponseDTO> getPaymentsByCustomer(Long customerUserId);

    // Payments of one owner
    List<PaymentResponseDTO> getPaymentsByOwner(Long ownerUserId);

    // Update status (PAID / FAILED / PENDING)
    PaymentResponseDTO updatePaymentStatus(Long paymentId, String status);

    // Delete payment
    void deletePayment(Long paymentId);
}
