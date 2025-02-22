package com.server.repositories;

import com.server.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> getFirstByUsername(String username);
    Optional<User> findByUsername(String username);
    User getFirstByEmail(String email);
}
