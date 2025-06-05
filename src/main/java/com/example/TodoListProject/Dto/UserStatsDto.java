package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.UserStats;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private Long id;
    private Integer level;
    private Integer exp;
    private Integer nextLevelExp;
    private Integer points;
    private Integer totalCompleted;
    private Long totalFocusTime;
    private Integer streak;

    // Entity를 DTO로 변환하는 메서드
    public static UserStatsDto fromEntity(UserStats userStats) {
        return UserStatsDto.builder()
                .id(userStats.getId())
                .level(userStats.getLevel())
                .exp(userStats.getExp())
                .nextLevelExp(userStats.getNextLevelExp())
                .points(userStats.getPoints())
                .totalCompleted(userStats.getTotalCompleted())
                .totalFocusTime(userStats.getTotalFocusTime())
                .streak(userStats.getStreak())
                .build();
    }
} 