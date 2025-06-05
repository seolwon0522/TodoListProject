package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.ShopItem;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Entity.UserItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserItemRepository extends JpaRepository<UserItem, Long> {
    List<UserItem> findByUser(User user);
    Optional<UserItem> findByUserAndItem(User user, ShopItem item);
    boolean existsByUserAndItem(User user, ShopItem item);
    List<UserItem> findByUserAndActive(User user, boolean active);
} 