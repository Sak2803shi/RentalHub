package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.CustomerDTO;
import com.project.dto.CustomerDashboardDTO;
import com.project.dto.CustomerResponseDTO;
import com.project.entities.Customer;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.CustomerRepository;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    private final AppointmentService appointmentService;
    private final LeaseAgreementService leaseService;
    private final PropertyService propertyService;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               ModelMapper modelMapper,
                               PasswordEncoder passwordEncoder,
                               AppointmentService appointmentService,
                               LeaseAgreementService leaseService,
                               PropertyService propertyService) {
        this.customerRepository = customerRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.appointmentService = appointmentService;
        this.leaseService = leaseService;
        this.propertyService = propertyService;
    }

    @Override
    public CustomerResponseDTO registerCustomer(CustomerDTO dto) {
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Customer customer = modelMapper.map(dto, Customer.class);
        customer.setPassword(passwordEncoder.encode(dto.getPassword()));

        Customer saved = customerRepository.save(customer);
        return modelMapper.map(saved, CustomerResponseDTO.class);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customer -> modelMapper.map(customer, CustomerResponseDTO.class))
                .toList();
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return modelMapper.map(customer, CustomerResponseDTO.class);
    }

    @Override
    public CustomerResponseDTO getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return modelMapper.map(customer, CustomerResponseDTO.class);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhno(dto.getPhno());
        existing.setDob(dto.getDob());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Customer updated = customerRepository.save(existing);
        return modelMapper.map(updated, CustomerResponseDTO.class);
    }

    @Override
    public String deleteCustomer(Long id) {
        customerRepository.deleteById(id);
        return "Customer deleted";
    }

    @Override
    public CustomerDashboardDTO getCustomerDashboard(Long id) {
        // Fetch profile
        CustomerResponseDTO profile = getCustomerById(id);

        // Fetch appointments for customer
        var appointments = appointmentService.getAppointmentsByCustomer(id);

        // Fetch leases for customer
        var leases = leaseService.getLeasesByCustomerId(id);

        // Fetch available properties (all)
        var properties = propertyService.getAvailableProperties();

        // Aggregate into dashboard DTO (you must have this DTO)
        return new CustomerDashboardDTO(profile, appointments, leases, properties);
    }
}
