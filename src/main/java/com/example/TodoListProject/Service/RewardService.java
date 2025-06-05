package com.example.TodoListProject.Service;

import com.example.TodoListProject.Dto.AchievementDto;
import com.example.TodoListProject.Dto.ShopItemDto;
import com.example.TodoListProject.Dto.UserStatsDto;
import com.example.TodoListProject.Entity.*;
import com.example.TodoListProject.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final ShopItemRepository shopItemRepository;
    private final UserItemRepository userItemRepository;
    private final PointService pointService;

    /**
     * 사용자 통계 정보 가져오기
     */
    @Transactional
    public UserStatsDto getUserStats(String userId) {
        User user = getUserByUserId(userId);
        
        // Check if userStats exists
        Optional<UserStats> existingStats = userStatsRepository.findByUser(user);
        
        // If not exists, create new stats
        if (existingStats.isEmpty()) {
            UserStats newStats = UserStats.createDefault(user);
            UserStats savedStats = userStatsRepository.save(newStats);
            return UserStatsDto.fromEntity(savedStats);
        }
        
        // Return existing stats
        return UserStatsDto.fromEntity(existingStats.get());
    }

    /**
     * 할 일 완료 시 보상 지급
     */
    @Transactional
    public UserStatsDto rewardForCompletedTodo(String userId, Integer difficulty) {
        User user = getUserByUserId(userId);
        UserStats userStats = getUserStats(user);

        // 난이도에 따른 경험치 및 포인트 지급
        int expReward = calculateExpReward(difficulty);
        int pointsReward = pointService.calculatePointsReward(difficulty);

        userStats.addExp(expReward);
        // 포인트 서비스를 통한 포인트 지급
        pointService.addPoints(userStats, pointsReward);
        userStats.setTotalCompleted(userStats.getTotalCompleted() + 1);

        // 완료 관련 업적 체크
        checkAchievements(user, userStats);

        return UserStatsDto.fromEntity(userStats);
    }

    /**
     * 집중 시간 보상 지급
     */
    @Transactional
    public UserStatsDto rewardForFocusTime(String userId, Long focusTimeInSeconds) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
            }
            
            if (focusTimeInSeconds == null || focusTimeInSeconds <= 0) {
                throw new IllegalArgumentException("유효하지 않은 집중 시간입니다: " + focusTimeInSeconds);
            }
            
            System.out.println("[집중 시간 보상] 사용자: " + userId + ", 추가된 집중 시간: " + focusTimeInSeconds + "초");
            
            User user = getUserByUserId(userId);
            UserStats userStats = getUserStats(user);

            // 기존 집중 시간
            Long previousFocusTime = userStats.getTotalFocusTime();
            
            // 10분당 경험치 5, 포인트 3 지급
            int expReward = (int) (focusTimeInSeconds / 600) * 5;
            int pointsReward = pointService.calculateFocusTimePointsReward(focusTimeInSeconds);

            // 최소 보상 보장 (10분 미만이라도 최소한의 보상 지급)
            if (focusTimeInSeconds >= 60 && expReward == 0) {
                expReward = 1;
            }
            
            System.out.println("[집중 시간 보상] 지급될 보상 - EXP: " + expReward + ", 포인트: " + pointsReward);
            
            // 보상 지급
            userStats.addExp(expReward);
            // 포인트 서비스를 통한 포인트 지급
            pointService.addPoints(userStats, pointsReward);
            userStats.setTotalFocusTime(userStats.getTotalFocusTime() + focusTimeInSeconds);
            
            System.out.println("[집중 시간 보상] 집중 시간 업데이트 - 이전: " + previousFocusTime + "초, 현재: " + userStats.getTotalFocusTime() + "초");

            // 변경 사항 저장
            userStatsRepository.save(userStats);
            
            // 집중 시간 관련 업적 체크
            checkAchievements(user, userStats);

            return UserStatsDto.fromEntity(userStats);
        } catch (Exception e) {
            System.err.println("[집중 시간 보상 오류] " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 업적 목록 조회
     */
    @Transactional(readOnly = true)
    public List<AchievementDto> getAchievements(String userId) {
        User user = getUserByUserId(userId);
        List<Achievement> allAchievements = achievementRepository.findAll();
        
        // 사용자 통계 정보 조회
        UserStats userStats = getUserStats(user);
        
        return allAchievements.stream()
                .map(achievement -> {
                    // 달성 여부 확인
                    List<UserAchievement> userAchievements = userAchievementRepository.findByUserAndAchievement(user, achievement);
                    boolean completed = !userAchievements.isEmpty();
                    
                    // 보상 수령 여부 확인
                    boolean rewardClaimed = completed && userAchievements.stream()
                            .anyMatch(UserAchievement::isRewardClaimed);
                    
                    // 현재 진행 상태 계산
                    Integer currentAmount = 0;
                    String conditionType = achievement.getConditionType();
                    
                    if ("todos_completed".equals(conditionType)) {
                        currentAmount = userStats.getTotalCompleted();
                    } else if ("focus_time".equals(conditionType)) {
                        currentAmount = userStats.getTotalFocusTime().intValue();
                    } else if ("streak".equals(conditionType)) {
                        currentAmount = userStats.getStreak();
                    }
                    
                    // 업적 완료 여부 재확인 (현재 상태 기준)
                    if (!completed && currentAmount >= achievement.getConditionValue()) {
                        completed = true;
                    }
                    
                    return AchievementDto.fromEntity(
                            achievement, 
                            completed, 
                            rewardClaimed, 
                            Math.min(currentAmount, achievement.getConditionValue()) // 초과 달성 시 최대값으로 제한
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * 업적 보상 수령
     */
    @Transactional
    public UserStatsDto claimAchievementReward(String userId, Long achievementId) {
        try {
            // 유저 검증
            if (userId == null || userId.trim().isEmpty()) {
                throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
            }
            
            // 업적 ID 검증
            if (achievementId == null || achievementId <= 0) {
                throw new IllegalArgumentException("유효하지 않은 업적 ID입니다.");
            }
            
            User user = getUserByUserId(userId);
            UserStats userStats = getUserStats(user);
            
            // 업적 존재 여부 확인
            Achievement achievement = achievementRepository.findById(achievementId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 업적입니다: " + achievementId));

            // 사용자가 해당 업적을 달성했는지 확인
            List<UserAchievement> userAchievements = userAchievementRepository.findByUserAndAchievement(user, achievement);
            if (userAchievements.isEmpty()) {
                throw new IllegalArgumentException("사용자가 달성하지 않은 업적입니다: userId=" + userId + ", achievementId=" + achievementId);
            }

            // 중복된 업적 기록이 있는 경우 첫 번째 항목 사용 (나머지는 나중에 정리 필요)
            UserAchievement userAchievement = userAchievements.get(0);
            
            // 이미 보상을 받았는지 확인
            if (userAchievement.isRewardClaimed()) {
                throw new IllegalArgumentException("이미 보상을 수령한 업적입니다: userId=" + userId + ", achievementId=" + achievementId);
            }

            // 중복 레코드가 있는 경우 로그 남기기
            if (userAchievements.size() > 1) {
                System.out.println("경고: 중복된 업적 발견 - userId=" + userId + ", achievementId=" + achievementId + ", 개수=" + userAchievements.size());
            }

            // 업적 보상 지급
            userStats.addExp(achievement.getExp());
            // 포인트 서비스를 통한 포인트 지급
            pointService.addPoints(userStats, achievement.getPoints());
            userAchievement.setRewardClaimed(true);

            // 변경사항 저장
            userStatsRepository.save(userStats);
            userAchievementRepository.save(userAchievement);

            return UserStatsDto.fromEntity(userStats);
        } catch (Exception e) {
            // 모든 예외 로깅
            System.err.println("업적 보상 수령 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e; // 원래 예외 다시 던지기
        }
    }

    /**
     * 상점 아이템 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ShopItemDto> getShopItems(String userId) {
        User user = getUserByUserId(userId);
        List<ShopItem> allItems = shopItemRepository.findAll();
        
        return allItems.stream()
                .map(item -> {
                    boolean purchased = userItemRepository.existsByUserAndItem(user, item);
                    return ShopItemDto.fromEntity(item, purchased);
                })
                .collect(Collectors.toList());
    }

    /**
     * 아이템 구매
     */
    @Transactional
    public UserStatsDto purchaseItem(String userId, Long itemId) {
        User user = getUserByUserId(userId);
        UserStats userStats = getUserStats(user);
        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이템입니다."));

        // 이미 구매한 아이템인지 확인
        if (userItemRepository.existsByUserAndItem(user, item)) {
            throw new IllegalArgumentException("이미 구매한 아이템입니다.");
        }

        // 포인트가 충분한지 확인 및 차감
        if (!pointService.usePoints(userStats, item.getPrice())) {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }

        // 아이템 구매 기록
        UserItem userItem = UserItem.builder()
                .user(user)
                .item(item)
                .purchasedAt(LocalDateTime.now())
                .active(false)
                .build();
        userItemRepository.save(userItem);

        return UserStatsDto.fromEntity(userStats);
    }

    /**
     * 아이템 활성화/비활성화
     */
    @Transactional
    public void toggleItemActive(String userId, Long userItemId) {
        User user = getUserByUserId(userId);
        UserItem userItem = userItemRepository.findById(userItemId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이템입니다."));

        // 해당 사용자의 아이템인지 확인
        if (!userItem.getUser().equals(user)) {
            throw new IllegalArgumentException("접근 권한이 없습니다.");
        }

        // 같은 타입의 다른 아이템들은 비활성화
        String itemType = userItem.getItem().getItemType();
        List<UserItem> activeItems = userItemRepository.findByUserAndActive(user, true);
        
        for (UserItem item : activeItems) {
            if (item.getItem().getItemType().equals(itemType)) {
                item.setActive(false);
            }
        }

        // 현재 아이템 상태 토글
        userItem.setActive(!userItem.isActive());
    }

    /**
     * 할 일 완료 취소 처리 (완료 → 다른 상태)
     */
    @Transactional
    public UserStatsDto adjustForUncompletedTodo(String userId) {
        User user = getUserByUserId(userId);
        
        // Find user stats
        UserStats userStats = userStatsRepository.findByUser(user)
                .orElseGet(() -> UserStats.createDefault(user));
        
        // Decrement completed count if greater than 0
        if (userStats.getTotalCompleted() > 0) {
            userStats.setTotalCompleted(userStats.getTotalCompleted() - 1);
            userStatsRepository.save(userStats);
        }
        
        return UserStatsDto.fromEntity(userStats);
    }

    /**
     * 유저 ID로 User 엔티티 조회
     */
    private User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    /**
     * 유저로 UserStats 조회 (없으면 생성)
     */
    @Transactional
    private UserStats getUserStats(User user) {
        Optional<UserStats> existingStats = userStatsRepository.findByUser(user);
        
        if (existingStats.isEmpty()) {
            UserStats newStats = UserStats.createDefault(user);
            return userStatsRepository.save(newStats);
        }
        
        return existingStats.get();
    }

    /**
     * 난이도에 따른 경험치 계산
     */
    private int calculateExpReward(Integer difficulty) {
        // 난이도에 따라 10, 20, 30점 지급
        return (difficulty == null ? 1 : difficulty) * 10;
    }

    /**
     * 업적 달성 체크
     */
    private void checkAchievements(User user, UserStats stats) {
        // 할일 완료 업적 체크
        checkTodoCompletionAchievements(user, stats);
        
        // 집중 시간 업적 체크
        checkFocusTimeAchievements(user, stats);
        
        // 연속 달성 업적 체크
        checkStreakAchievements(user, stats);
    }

    private void checkTodoCompletionAchievements(User user, UserStats stats) {
        try {
            // 할 일 완료 업적 목록 조회
            List<Achievement> achievements = achievementRepository.findByConditionType("todos_completed");
            System.out.println("[업적 체크] 할 일 완료 업적 체크 시작 - 현재 완료 개수: " + stats.getTotalCompleted());
            
            for (Achievement achievement : achievements) {
                System.out.println("[업적 체크] 검사 중: " + achievement.getTitle() + 
                                   " - 조건: " + achievement.getConditionValue() + 
                                   ", 현재: " + stats.getTotalCompleted());
                
                if (stats.getTotalCompleted() >= achievement.getConditionValue() &&
                        !userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
                    
                    // 새 업적 달성 저장
                    UserAchievement userAchievement = UserAchievement.builder()
                            .user(user)
                            .achievement(achievement)
                            .achievedAt(LocalDateTime.now())
                            .rewardClaimed(false)
                            .build();
                    userAchievementRepository.save(userAchievement);
                    
                    System.out.println("[업적 달성] " + achievement.getTitle() + " 업적 달성! - 사용자: " + user.getUserId());
                } else if (stats.getTotalCompleted() >= achievement.getConditionValue()) {
                    System.out.println("[업적 체크] 이미 달성한 업적: " + achievement.getTitle());
                } else {
                    System.out.println("[업적 체크] 아직 달성 조건 미충족: " + achievement.getTitle() + 
                                      " (" + stats.getTotalCompleted() + "/" + achievement.getConditionValue() + ")");
                }
            }
        } catch (Exception e) {
            System.err.println("[업적 체크 오류] 할 일 완료 업적 체크 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void checkFocusTimeAchievements(User user, UserStats stats) {
        try {
            // 집중 시간 업적 목록 조회
            List<Achievement> achievements = achievementRepository.findByConditionType("focus_time");
            System.out.println("[업적 체크] 집중 시간 업적 체크 시작 - 현재 집중 시간: " + stats.getTotalFocusTime() + "초");
            
            for (Achievement achievement : achievements) {
                System.out.println("[업적 체크] 검사 중: " + achievement.getTitle() + 
                                   " - 조건: " + achievement.getConditionValue() + "초" + 
                                   ", 현재: " + stats.getTotalFocusTime() + "초");
                
                if (stats.getTotalFocusTime() >= achievement.getConditionValue() &&
                        !userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
                    
                    // 새 업적 달성 저장
                    UserAchievement userAchievement = UserAchievement.builder()
                            .user(user)
                            .achievement(achievement)
                            .achievedAt(LocalDateTime.now())
                            .rewardClaimed(false)
                            .build();
                    userAchievementRepository.save(userAchievement);
                    
                    System.out.println("[업적 달성] " + achievement.getTitle() + " 업적 달성! - 사용자: " + user.getUserId());
                } else if (stats.getTotalFocusTime() >= achievement.getConditionValue()) {
                    System.out.println("[업적 체크] 이미 달성한 업적: " + achievement.getTitle());
                } else {
                    System.out.println("[업적 체크] 아직 달성 조건 미충족: " + achievement.getTitle() + 
                                      " (" + stats.getTotalFocusTime() + "/" + achievement.getConditionValue() + "초)");
                }
            }
        } catch (Exception e) {
            System.err.println("[업적 체크 오류] 집중 시간 업적 체크 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void checkStreakAchievements(User user, UserStats stats) {
        List<Achievement> achievements = achievementRepository.findByConditionType("streak");
        for (Achievement achievement : achievements) {
            if (stats.getStreak() >= achievement.getConditionValue() &&
                    !userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
                UserAchievement userAchievement = UserAchievement.builder()
                        .user(user)
                        .achievement(achievement)
                        .achievedAt(LocalDateTime.now())
                        .rewardClaimed(false)
                        .build();
                userAchievementRepository.save(userAchievement);
            }
        }
    }
} 