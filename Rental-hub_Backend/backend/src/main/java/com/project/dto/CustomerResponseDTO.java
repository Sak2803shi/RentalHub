package com.project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.entities.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerResponseDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phno;
    private Role role;
    private LocalDate dob;
    private LocalDateTime createdAt;

    // getters and setters
}

