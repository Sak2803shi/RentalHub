package com.paymentdemo.external.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OwnerDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;

}
