package com.project.service;

import java.util.List;
import com.project.dto.AgentRegisterDTO;
import com.project.dto.AgentResponseDTO;

public interface AgentService {

    AgentResponseDTO registerAgent(AgentRegisterDTO dto);

    List<AgentResponseDTO> getAllAgents();

    AgentResponseDTO getAgentById(Long id);

    AgentResponseDTO updateAgent(Long id, AgentRegisterDTO dto);

    String deleteAgent(Long id);
    AgentResponseDTO getAgentByEmail(String email);

}
