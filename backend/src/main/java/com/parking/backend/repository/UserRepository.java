package com.parking.backend.repository;

import com.parking.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    
}