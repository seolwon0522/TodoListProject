package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "points")
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 사용자 참조 (다대일 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // 이번 포인트 계산에 사용된 집중시간 (초 단위)
    @Column(name = "focus_time_used", nullable = false)
    private Long focusTimeUsed;
    
    // 획득한 포인트 (focus_time_used / 60)
    @Column(name = "points_earned", nullable = false)
    private Long pointsEarned;
    
    // 포인트 획득 시각
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
} 