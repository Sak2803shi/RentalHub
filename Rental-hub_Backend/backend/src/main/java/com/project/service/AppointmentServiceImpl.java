package com.project.service;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.AppointmentRequestDTO;
import com.project.dto.AppointmentResponseDTO;
import com.project.entities.Appointment;
import com.project.entities.Customer;
import com.project.entities.Property;
import com.project.repository.AgentRepository;
import com.project.repository.AppointmentRepository;
import com.project.repository.CustomerRepository;
import com.project.repository.OwnerRepository;
import com.project.repository.PropertyRepository;


@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final CustomerRepository customerRepo;
    private final PropertyRepository propertyRepo;
    private final OwnerRepository ownerRepo;
    private final AgentRepository agentRepo;

    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepo,
            CustomerRepository customerRepo,
            PropertyRepository propertyRepo,
            OwnerRepository ownerRepo,
            AgentRepository agentRepo) {
        this.appointmentRepo = appointmentRepo;
        this.customerRepo = customerRepo;
        this.propertyRepo = propertyRepo;
        this.ownerRepo = ownerRepo;
        this.agentRepo = agentRepo;
    }

    // ================= CREATE =================
    @Override
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto) {

        if ((dto.getOwnerId() == null) == (dto.getAgentId() == null)) {
            throw new RuntimeException("Provide either ownerId OR agentId");
        }

        Customer customer = customerRepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Property property = propertyRepo.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getIsAvailable()) {
            throw new RuntimeException("Property not available");
        }

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setProperty(property);

        if (dto.getOwnerId() != null) {
            appointment.setOwner(ownerRepo.findById(dto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found")));
        } else {
            appointment.setAgent(agentRepo.findById(dto.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found")));
        }

        return mapToDTO(appointmentRepo.save(appointment));
    }

    // ================= GET ALL =================
    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= CUSTOMER =================
    @Override
    public List<AppointmentResponseDTO> getAppointmentsByCustomer(Long customerId) {
        return appointmentRepo.findByCustomerUserId(customerId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= ⭐ AGENT APPOINTMENTS =================
    @Override
    public List<AppointmentResponseDTO> getAppointmentsForLoggedInAgent(Long agentId) {
        return appointmentRepo.findByAgentUserId(agentId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= DELETE =================
    @Override
    public String deleteAppointment(Long appointmentId) {
        appointmentRepo.deleteById(appointmentId);
        return "Appointment cancelled";
    }

    // ================= UPDATE =================
    @Override
    public AppointmentResponseDTO updateAppointment(Long id, AppointmentRequestDTO dto) {

        Appointment appointment = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (dto.getPropertyId() != null) {
            Property property = propertyRepo.findById(dto.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            appointment.setProperty(property);
        }

        if (dto.getOwnerId() != null) {
            appointment.setOwner(ownerRepo.findById(dto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found")));
            appointment.setAgent(null);
        }

        if (dto.getAgentId() != null) {
            appointment.setAgent(agentRepo.findById(dto.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found")));
            appointment.setOwner(null);
        }

        return mapToDTO(appointmentRepo.save(appointment));
    }

    // ================= DTO MAPPING =================
    private AppointmentResponseDTO mapToDTO(Appointment a) {

        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setAppointmentId(a.getAppointmentId());

        dto.setCustomerId(a.getCustomer().getUserId());
        dto.setCustomerName(a.getCustomer().getFirstName());

        dto.setPropertyId(a.getProperty().getPropertyId());
        dto.setPropertyTitle(a.getProperty().getTitle());

        if (a.getOwner() != null) {
            dto.setHandledBy("OWNER");
            dto.setHandlerName(a.getOwner().getFirstName());
        } else if (a.getAgent() != null) {
            dto.setHandledBy("AGENT");
            dto.setHandlerName(a.getAgent().getFirstName());
        }

        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }

	@Override
	public List<AppointmentResponseDTO> getAppointmentsByOwner(Long ownerUserId) {
		return appointmentRepo.findByCustomerUserId(ownerUserId)
                .stream()
                .map(this::mapToDTO)
                .toList();
	}

	
}
