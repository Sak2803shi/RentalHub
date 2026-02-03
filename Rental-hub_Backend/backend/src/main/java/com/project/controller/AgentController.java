package com.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.AgentRegisterDTO;
import com.project.dto.AgentResponseDTO;
import com.project.service.AgentService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/register")
    public ResponseEntity<AgentResponseDTO> registerAgent(@RequestBody AgentRegisterDTO dto) {
        return ResponseEntity.ok(agentService.registerAgent(dto));
    }

    @GetMapping
    public ResponseEntity<List<AgentResponseDTO>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentResponseDTO> getAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AgentResponseDTO> getAgentByEmail(@PathVariable String email) {
        return ResponseEntity.ok(agentService.getAgentByEmail(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentResponseDTO> updateAgent(@PathVariable Long id,
                                                        @RequestBody AgentRegisterDTO dto) {
        return ResponseEntity.ok(agentService.updateAgent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAgent(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.deleteAgent(id));
    }
}
