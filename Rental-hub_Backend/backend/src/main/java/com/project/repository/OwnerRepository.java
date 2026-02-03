package com.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entities.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    boolean existsByEmail(String email);
    Optional<Owner> findByEmail(String email);

}
