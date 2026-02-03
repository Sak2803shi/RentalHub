package com.paymentdemo.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.paymentdemo.config.FeignClientConfig;
import com.paymentdemo.external.dto.OwnerDTO;

@FeignClient(name = "owner-service", url = "http://localhost:8080", configuration = FeignClientConfig.class)
public interface OwnerClient {

    @GetMapping("/api/owners/{id}")
    OwnerDTO getOwnerByUserId(@PathVariable Long id);
}
