package com.example.TodoListProject.Service;

import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Entity.UserStats;
import com.example.TodoListProject.Repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 포인트 관련 서비스
 */
@Service
@RequiredArgsConstructor
public class PointService {

    private final UserStatsRepository userStatsRepository;

    /**
     * 포인트 지급
     */
    @Transactional
    public void addPoints(UserStats userStats, int points) {
        userStats.addPoints(points);
        userStatsRepository.save(userStats);
        System.out.println("[포인트 지급] " + points + "포인트 지급됨 - 현재 포인트: " + userStats.getPoints());
    }

    /**
     * 포인트 차감
     */
    @Transactional
    public boolean usePoints(UserStats userStats, int points) {
        if (userStats.getPoints() < points) {
            return false;
        }
        
        userStats.usePoints(points);
        userStatsRepository.save(userStats);
        System.out.println("[포인트 차감] " + points + "포인트 차감됨 - 현재 포인트: " + userStats.getPoints());
        return true;
    }

    /**
     * 난이도에 따른 포인트 계산
     */
    public int calculatePointsReward(Integer difficulty) {
        // 난이도에 따라 5, 10, 15점 지급
        return (difficulty == null ? 1 : difficulty) * 5;
    }

    /**
     * 집중 시간에 따른 포인트 계산
     */
    public int calculateFocusTimePointsReward(Long focusTimeInSeconds) {
        // 10분당 포인트 3 지급
        int pointsReward = (int) (focusTimeInSeconds / 600) * 3;
        
        // 최소 보상 보장 (10분 미만이라도 최소한의 보상 지급)
        if (focusTimeInSeconds >= 60 && pointsReward == 0) {
            pointsReward = 1;
        }
        
        return pointsReward;
    }
} 