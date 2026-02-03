package com.paymentdemo.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.paymentdemo.external.dto.LeaseAgreementDTO;

@FeignClient(name = "main-app", url = "http://localhost:8080")
public interface LeaseClient {

    @GetMapping("/api/leases/{id}")
    LeaseAgreementDTO getLease(@PathVariable Long id);
}
