package com.project.dto;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponseDTO {

	private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phno;
    private String agencyName;
    private Double commissionRate;
}

