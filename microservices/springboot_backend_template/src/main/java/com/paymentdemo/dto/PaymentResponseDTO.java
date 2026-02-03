package com.paymentdemo.dto;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class PaymentResponseDTO {

	private Long paymentId;
    private Long leaseId;
    private Long customerUserId;
    private String customerName;
    private Long ownerUserId;
    private String ownerName;
    private Double amount;
    private String paymentMethod;
    private String status;
    private LocalDateTime paymentDate;
}

