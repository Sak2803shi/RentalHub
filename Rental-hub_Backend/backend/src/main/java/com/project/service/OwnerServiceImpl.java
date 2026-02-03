package com.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.OwnerRegisterDTO;
import com.project.dto.OwnerResponseDTO;
import com.project.entities.Owner;
import com.project.entities.Role;
import com.project.exception.DuplicateResourceException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.OwnerRepository;

@Service
@Transactional
public class OwnerServiceImpl implements OwnerService {

    private final OwnerRepository ownerRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public OwnerServiceImpl(OwnerRepository ownerRepository,
                            ModelMapper modelMapper,
                            PasswordEncoder passwordEncoder) {
        this.ownerRepository = ownerRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OwnerResponseDTO registerOwner(OwnerRegisterDTO dto) {

        if (ownerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Owner owner = new Owner();
        owner.setFirstName(dto.getFirstName());
        owner.setLastName(dto.getLastName());
        owner.setEmail(dto.getEmail());
        owner.setPhno(dto.getPhno());
        owner.setDob(dto.getDob());
        owner.setPassword(passwordEncoder.encode(dto.getPassword()));
        owner.setRole(Role.OWNER);
        owner.setVerifiedStatus(false); // default

        Owner saved = ownerRepository.save(owner);
        return modelMapper.map(saved, OwnerResponseDTO.class);
    }

    @Override
    public List<OwnerResponseDTO> getAllOwners() {
        return ownerRepository.findAll()
                .stream()
                .map(owner -> modelMapper.map(owner, OwnerResponseDTO.class))
                .toList();
    }

    @Override
    public OwnerResponseDTO getOwnerById(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + id));

        return modelMapper.map(owner, OwnerResponseDTO.class);
    }

    @Override
    public OwnerResponseDTO updateOwner(Long id, OwnerRegisterDTO dto) {

        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        owner.setFirstName(dto.getFirstName());
        owner.setLastName(dto.getLastName());
        owner.setPhno(dto.getPhno());
        owner.setDob(dto.getDob());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            owner.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Owner updated = ownerRepository.save(owner);
        return modelMapper.map(updated, OwnerResponseDTO.class);
    }

    @Override
    public String deleteOwner(Long id) {

        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        ownerRepository.delete(owner);
        return "Owner deleted";
    }

    @Override
    public OwnerResponseDTO getOwnerByEmail(String email) {
        Owner owner = ownerRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found with email: " + email));
        return modelMapper.map(owner, OwnerResponseDTO.class);
    }


}
