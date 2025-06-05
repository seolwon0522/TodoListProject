package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    private String icon;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private Integer exp;

    // 검증 조건 타입 (todos_completed, focus_time, streak, ...)
    @Column(nullable = false)
    private String conditionType;

    // 업적 달성에 필요한 값 (ex: 10개 완료, 3600초 집중 등)
    @Column(nullable = false)
    private Integer conditionValue;
} 