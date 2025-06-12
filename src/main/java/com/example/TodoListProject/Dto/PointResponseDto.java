package com.example.TodoListProject.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointResponseDto {
    private Long totalPoints;
    private Long totalFocusTimeUsed;
    private Long newPointsEarned;
    private String message;
} 