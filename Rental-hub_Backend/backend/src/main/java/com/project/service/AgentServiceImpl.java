package com.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.dto.AgentRegisterDTO;
import com.project.dto.AgentResponseDTO;
import com.project.entities.Agent;
import com.project.repository.AgentRepository;

@Service
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;

    public AgentServiceImpl(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    private AgentResponseDTO mapToDTO(Agent agent) {
        AgentResponseDTO dto = new AgentResponseDTO();
        dto.setUserId(agent.getUserId());
        dto.setFirstName(agent.getFirstName());
        dto.setLastName(agent.getLastName());
        dto.setEmail(agent.getEmail());
        dto.setPhno(agent.getPhno());
        dto.setAgencyName(agent.getAgencyName());
        dto.setCommissionRate(agent.getCommissionRate());
        return dto;
    }

    @Override
    public AgentResponseDTO registerAgent(AgentRegisterDTO dto) {
        Agent agent = new Agent();
        agent.setFirstName(dto.getFirstName());
        agent.setLastName(dto.getLastName());
        agent.setEmail(dto.getEmail());
        agent.setPassword(dto.getPassword());
        agent.setPhno(dto.getPhno());
        agent.setDob(dto.getDob());
        agent.setAgencyName(dto.getAgencyName());
        agent.setCommissionRate(dto.getCommissionRate());

        Agent saved = agentRepository.save(agent);
        return mapToDTO(saved);
    }

    @Override
    public List<AgentResponseDTO> getAllAgents() {
        return agentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AgentResponseDTO getAgentById(Long id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return mapToDTO(agent);
    }

    @Override
    public AgentResponseDTO getAgentByEmail(String email) {
        Agent agent = agentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found with email: " + email));
        return mapToDTO(agent);
    }

    @Override
    public AgentResponseDTO updateAgent(Long id, AgentRegisterDTO dto) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setFirstName(dto.getFirstName());
        agent.setLastName(dto.getLastName());
        agent.setEmail(dto.getEmail());
        agent.setPhno(dto.getPhno());
        agent.setDob(dto.getDob());
        agent.setAgencyName(dto.getAgencyName());
        agent.setCommissionRate(dto.getCommissionRate());

        Agent updated = agentRepository.save(agent);
        return mapToDTO(updated);
    }

    @Override
    public String deleteAgent(Long id) {
        agentRepository.deleteById(id);
        return "Agent deleted";
    }
}
