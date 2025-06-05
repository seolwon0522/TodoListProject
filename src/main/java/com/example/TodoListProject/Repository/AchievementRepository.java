package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByConditionType(String conditionType);
} 