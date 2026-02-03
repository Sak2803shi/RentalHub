package com.project.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByCustomerUserIdAndPropertyPropertyId(
            Long customerUserid,
            Long propertyId
    );

    List<Appointment> findByCustomerUserId(Long customerUserid);
    List<Appointment> findByAgentUserId(Long agentId);
    List<Appointment> findByOwnerUserId(Long ownerUserid);

}
