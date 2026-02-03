package com.paymentdemo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDTO {

	    private Long leaseId;
	    private Long customerUserId;
	    private Long ownerUserId;
	    private Double amount;
	    private String paymentMethod;
	    private String status;
	
}

