package com.project.controller;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.entities.Agent;
import com.project.entities.Customer;
import com.project.entities.Owner;
import com.project.entities.User;
import com.project.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // Add Owner
    @PostMapping("/owner")
    public Owner addOwner(@RequestBody Owner owner) {
        return adminService.addOwner(owner);
    }

    // Add Agent
    @PostMapping("/agent")
    public Agent addAgent(@RequestBody Agent agent) {
        return adminService.addAgent(agent);
    }

    // Add Customer
    @PostMapping("/customer")
    public Customer addCustomer(@RequestBody Customer customer) {
        return adminService.addCustomer(customer);
    }

    // View All Users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    // Delete User
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "User deleted";
    }

    // Update User
    @PutMapping("/user/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return adminService.updateUser(id, user);
    }
}
