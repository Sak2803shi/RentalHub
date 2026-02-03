package com.project.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.entities.Agent;
import com.project.entities.Customer;
import com.project.entities.Owner;
import com.project.entities.Role;
import com.project.entities.User;
import com.project.repository.AgentRepository;
import com.project.repository.CustomerRepository;
import com.project.repository.OwnerRepository;
import com.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final OwnerRepository ownerRepo;
    private final AgentRepository agentRepo;
    private final CustomerRepository customerRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public Owner addOwner(Owner owner) {
        owner.setPassword(encoder.encode(owner.getPassword()));
        owner.setRole(Role.OWNER);
        return ownerRepo.save(owner);
    }

    @Override
    public Agent addAgent(Agent agent) {
        agent.setPassword(encoder.encode(agent.getPassword()));
        agent.setRole(Role.AGENT);
        return agentRepo.save(agent);
    }

    @Override
    public Customer addCustomer(Customer customer) {
        customer.setPassword(encoder.encode(customer.getPassword()));
        customer.setRole(Role.CUSTOMER);
        return customerRepo.save(customer);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhno(updatedUser.getPhno());

        return userRepo.save(user);
    }
}
