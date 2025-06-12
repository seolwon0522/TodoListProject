package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    boolean existsByUserId(String userId);

    Optional<User> findByUserId(String userId);

}