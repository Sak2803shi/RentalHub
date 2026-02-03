package com.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entities.Agent;

public interface AgentRepository extends JpaRepository<Agent, Long> {

    boolean existsByEmail(String email);

	Optional<Agent> findByEmail(String email);
}
