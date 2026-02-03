package com.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entities.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByIsAvailableTrue();

    // Owner extends User → use id
    List<Property> findByOwnerUserId(Long ownerId);

    // Agent extends User → use id
    List<Property> findByAgentUserId(Long agentId);
    
}
