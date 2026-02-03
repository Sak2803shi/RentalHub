package com.paymentdemo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paymentdemo.dto.PaymentRequestDTO;
import com.paymentdemo.dto.PaymentResponseDTO;
import com.paymentdemo.entity.Payment;
import com.paymentdemo.external.CustomerClient;
import com.paymentdemo.external.OwnerClient;
import com.paymentdemo.external.LeaseClient;
import com.paymentdemo.external.dto.CustomerDTO;
import com.paymentdemo.external.dto.OwnerDTO;
import com.paymentdemo.external.dto.LeaseAgreementDTO;
import com.paymentdemo.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final CustomerClient customerClient;
    private final OwnerClient ownerClient;
    private final LeaseClient leaseClient;

    // ✅ CREATE PAYMENT
    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {

        // 🔹 Call MAIN SERVICE to validate data
        CustomerDTO customer = customerClient.getCustomerByUserId(dto.getCustomerUserId());
        OwnerDTO owner = ownerClient.getOwnerByUserId(dto.getOwnerUserId());
        LeaseAgreementDTO lease = leaseClient.getLease(dto.getLeaseId());

        Payment payment = new Payment();
        payment.setCustomerUserId(customer.getUserId());
        payment.setOwnerUserId(owner.getUserId());
        payment.setLeaseId(lease.getLeaseId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus("PAID");

        Payment saved = paymentRepo.save(payment);

        return mapToDTO(saved, customer, owner);
    }

    // ✅ GET PAYMENT BY ID
    @Override
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        CustomerDTO customer = customerClient.getCustomerByUserId(payment.getCustomerUserId());
        OwnerDTO owner = ownerClient.getOwnerByUserId(payment.getOwnerUserId());

        return mapToDTO(payment, customer, owner);
    }

    // ✅ GET ALL
    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepo.findAll()
                .stream()
                .map(p -> mapToDTO(
                        p,
                        customerClient.getCustomerByUserId(p.getCustomerUserId()),
                        ownerClient.getOwnerByUserId(p.getOwnerUserId())
                ))
                .toList();
    }

    // ✅ CUSTOMER PAYMENTS
    @Override
    public List<PaymentResponseDTO> getPaymentsByCustomer(Long customerUserId) {
        return paymentRepo.findByCustomerUserId(customerUserId)
                .stream()
                .map(p -> mapToDTO(
                        p,
                        customerClient.getCustomerByUserId(p.getCustomerUserId()),
                        ownerClient.getOwnerByUserId(p.getOwnerUserId())
                ))
                .toList();
    }

    // ✅ OWNER PAYMENTS
    @Override
    public List<PaymentResponseDTO> getPaymentsByOwner(Long ownerUserId) {
        return paymentRepo.findByOwnerUserId(ownerUserId)
                .stream()
                .map(p -> mapToDTO(
                        p,
                        customerClient.getCustomerByUserId(p.getCustomerUserId()),
                        ownerClient.getOwnerByUserId(p.getOwnerUserId())
                ))
                .toList();
    }

    // ✅ UPDATE STATUS
    @Override
    public PaymentResponseDTO updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(status);
        Payment updated = paymentRepo.save(payment);

        CustomerDTO customer = customerClient.getCustomerByUserId(updated.getCustomerUserId());
        OwnerDTO owner = ownerClient.getOwnerByUserId(updated.getOwnerUserId());

        return mapToDTO(updated, customer, owner);
    }

    // ✅ DELETE
    @Override
    public void deletePayment(Long id) {
        paymentRepo.deleteById(id);
    }

    // 🔁 MAPPER
    private PaymentResponseDTO mapToDTO(Payment p, CustomerDTO c, OwnerDTO o) {

        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(p.getPaymentId());
        dto.setLeaseId(p.getLeaseId());
        dto.setCustomerUserId(p.getCustomerUserId());
        dto.setOwnerUserId(p.getOwnerUserId());
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setStatus(p.getStatus());
        dto.setPaymentDate(p.getPaymentDate());

        dto.setCustomerName(c.getFirstName() + " " + c.getLastName());
        dto.setOwnerName(o.getFirstName() + " " + o.getLastName());

        return dto;
    }
}
