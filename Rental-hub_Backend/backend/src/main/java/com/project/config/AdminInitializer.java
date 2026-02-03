package com.project.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.entities.Admin;
import com.project.entities.Role;
import com.project.repository.AdminRepository;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner createDefaultAdmin(AdminRepository adminRepo,
                                                PasswordEncoder encoder) {
        return args -> {

            if (adminRepo.count() == 0) {

                Admin admin = new Admin();
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setEmail("admin@mail.com");
                admin.setPhno("9999999999");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                adminRepo.save(admin);

                System.out.println("🔥 DEFAULT ADMIN CREATED 🔥");
            } else {
                System.out.println("✅ Admin already exists");
            }
        };
    }
}
