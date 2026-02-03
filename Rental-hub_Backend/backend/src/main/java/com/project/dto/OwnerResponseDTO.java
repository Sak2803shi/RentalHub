package com.project.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OwnerResponseDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phno;
    private LocalDate dob;
    private Boolean verifiedStatus;
    private String role;
}
