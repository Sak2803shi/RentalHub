package com.project.service;

import java.util.List;
import com.project.dto.AppointmentRequestDTO;
import com.project.dto.AppointmentResponseDTO;
import com.project.entities.Appointment;

public interface AppointmentService {

    AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto);

    List<AppointmentResponseDTO> getAllAppointments();

    List<AppointmentResponseDTO> getAppointmentsByCustomer(Long customerId);

    String deleteAppointment(Long appointmentId);

	AppointmentResponseDTO updateAppointment(Long id, AppointmentRequestDTO dto);
	List<AppointmentResponseDTO> getAppointmentsForLoggedInAgent(Long agentId);

	List<AppointmentResponseDTO> getAppointmentsByOwner(Long ownerUserId);

}
