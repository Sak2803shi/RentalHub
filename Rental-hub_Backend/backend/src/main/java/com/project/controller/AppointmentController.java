package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.project.dto.AppointmentRequestDTO;
import com.project.dto.AppointmentResponseDTO;
import com.project.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Create a new appointment
    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody AppointmentRequestDTO dto) {
        AppointmentResponseDTO response = appointmentService.createAppointment(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Update appointment
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public ResponseEntity<AppointmentResponseDTO> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequestDTO dto) {

        AppointmentResponseDTO updated = appointmentService.updateAppointment(id, dto);
        return ResponseEntity.ok(updated);
    }

    // Get all appointments
    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        List<AppointmentResponseDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    // Delete appointment by appointmentId
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
    
    
    // Get appointments by customer userId
    
    @GetMapping("/customer/{customerUserId}")
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointmentsByCustomer(
            @PathVariable Long customerUserId) {

        List<AppointmentResponseDTO> appointments = appointmentService.getAppointmentsByCustomer(customerUserId);
        return ResponseEntity.ok(appointments);
    }
    

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointmentsByAgent(@PathVariable Long agentId) {
        List<AppointmentResponseDTO> appointments = appointmentService.getAppointmentsForLoggedInAgent(agentId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/owner/{ownerUserId}")
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointmentsByOwner(
            @PathVariable Long ownerUserId) {

        List<AppointmentResponseDTO> appointments = appointmentService.getAppointmentsByOwner(ownerUserId);
        return ResponseEntity.ok(appointments);
    }
}
