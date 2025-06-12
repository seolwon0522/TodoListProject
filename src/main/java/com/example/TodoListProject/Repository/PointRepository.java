package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.Point;
import com.example.TodoListProject.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    
    // 사용자의 모든 포인트 기록 조회 (최신순)
    List<Point> findByUserOrderByCreatedAtDesc(User user);
} 