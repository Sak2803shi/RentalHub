package com.project.service;

import java.util.List;
import com.project.dto.OwnerRegisterDTO;
import com.project.dto.OwnerResponseDTO;

public interface OwnerService {

    OwnerResponseDTO registerOwner(OwnerRegisterDTO dto);

    List<OwnerResponseDTO> getAllOwners();

    OwnerResponseDTO getOwnerById(Long id);

    OwnerResponseDTO updateOwner(Long id, OwnerRegisterDTO dto);

    String deleteOwner(Long id);

	OwnerResponseDTO getOwnerByEmail(String email);
}
