package com.server.repositories;

import com.server.domain.entities.Car;
import com.server.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {
    Car findFirstById(String id);
    Page<Car> findAllByOwner(User owner, Pageable pageable);
    Page<Car> findAllByBrandContainsOrModelContainsOrderByBrand(Pageable pageable, String brand, String query);
}
