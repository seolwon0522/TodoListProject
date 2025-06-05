package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer level;
    private Integer exp;
    private Integer nextLevelExp;
    private Integer points;
    private Integer totalCompleted;
    private Long totalFocusTime;
    private Integer streak;

    // 사용자 통계 초기화 메서드
    public static UserStats createDefault(User user) {
        return UserStats.builder()
                .user(user)
                .level(1)
                .exp(0)
                .nextLevelExp(100) // 레벨 1에서 2로 가기 위한 경험치
                .points(0)
                .totalCompleted(0)
                .totalFocusTime(0L)
                .streak(0)
                .build();
    }

    // 경험치 추가 메서드
    public void addExp(Integer expAmount) {
        this.exp += expAmount;
        
        // 레벨업 체크
        while (this.exp >= this.nextLevelExp) {
            levelUp();
        }
    }

    // 레벨업 메서드
    private void levelUp() {
        this.level++;
        this.exp -= this.nextLevelExp;
        this.nextLevelExp = calculateNextLevelExp();
    }

    // 다음 레벨 경험치 계산 (레벨이 올라갈수록 필요 경험치 증가)
    private Integer calculateNextLevelExp() {
        return (int)(100 * (1 + (this.level * 0.5)));
    }

    // 포인트 추가 메서드
    public void addPoints(Integer amount) {
        this.points += amount;
    }

    // 포인트 사용 메서드
    public boolean usePoints(Integer amount) {
        if (this.points >= amount) {
            this.points -= amount;
            return true;
        }
        return false;
    }
} 