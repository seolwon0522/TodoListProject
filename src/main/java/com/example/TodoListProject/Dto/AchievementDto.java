package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.Achievement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementDto {
    private Long id;
    private String title;
    private String description;
    private String icon;
    private Integer points;
    private Integer exp;
    private String conditionType;
    private Integer conditionValue;
    private Integer currentAmount;
    private boolean completed;
    private boolean rewardClaimed;

    // Entity를 DTO로 변환하는 메서드 (보상 수령 여부 미포함)
    public static AchievementDto fromEntity(Achievement achievement, boolean completed) {
        return AchievementDto.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .icon(achievement.getIcon())
                .points(achievement.getPoints())
                .exp(achievement.getExp())
                .conditionType(achievement.getConditionType())
                .conditionValue(achievement.getConditionValue())
                .currentAmount(0)
                .completed(completed)
                .rewardClaimed(false) // 기본값으로 false 설정
                .build();
    }
    
    // Entity를 DTO로 변환하는 메서드 (보상 수령 여부 포함)
    public static AchievementDto fromEntity(Achievement achievement, boolean completed, boolean rewardClaimed) {
        return AchievementDto.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .icon(achievement.getIcon())
                .points(achievement.getPoints())
                .exp(achievement.getExp())
                .conditionType(achievement.getConditionType())
                .conditionValue(achievement.getConditionValue())
                .currentAmount(0)
                .completed(completed)
                .rewardClaimed(rewardClaimed)
                .build();
    }
    
    // Entity를 DTO로 변환하는 메서드 (현재 진행 상태 포함)
    public static AchievementDto fromEntity(Achievement achievement, boolean completed, boolean rewardClaimed, Integer currentAmount) {
        return AchievementDto.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .icon(achievement.getIcon())
                .points(achievement.getPoints())
                .exp(achievement.getExp())
                .conditionType(achievement.getConditionType())
                .conditionValue(achievement.getConditionValue())
                .currentAmount(currentAmount)
                .completed(completed)
                .rewardClaimed(rewardClaimed)
                .build();
    }
} 