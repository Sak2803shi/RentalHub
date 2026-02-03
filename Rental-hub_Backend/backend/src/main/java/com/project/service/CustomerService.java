package com.project.service;

import java.util.List;

import com.project.dto.CustomerDTO;
import com.project.dto.CustomerDashboardDTO;
import com.project.dto.CustomerResponseDTO;

public interface CustomerService {

    CustomerResponseDTO registerCustomer(CustomerDTO dto);

    List<CustomerResponseDTO> getAllCustomers();

    CustomerResponseDTO getCustomerById(Long id);

    CustomerResponseDTO getCustomerByEmail(String email);

    CustomerResponseDTO updateCustomer(Long id, CustomerDTO dto);

    String deleteCustomer(Long id);

    CustomerDashboardDTO getCustomerDashboard(Long id);
}
