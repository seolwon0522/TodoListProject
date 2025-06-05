package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Enum.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo,Long> {
    List<Todo> findByUser(User user);
    List<Todo> findByUserAndStatus(User user, Status status);
}