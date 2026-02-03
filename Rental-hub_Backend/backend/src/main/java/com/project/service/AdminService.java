package com.project.service;
import java.util.List;

import com.project.entities.Agent;
import com.project.entities.Customer;
import com.project.entities.Owner;
import com.project.entities.User;

public interface AdminService {

    Owner addOwner(Owner owner);
    Agent addAgent(Agent agent);
    Customer addCustomer(Customer customer);

    List<User> getAllUsers();

    void deleteUser(Long id);

    User updateUser(Long id, User user);
}
