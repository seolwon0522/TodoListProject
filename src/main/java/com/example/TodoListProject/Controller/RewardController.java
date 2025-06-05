package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.AchievementDto;
import com.example.TodoListProject.Dto.ShopItemDto;
import com.example.TodoListProject.Dto.UserStatsDto;
import com.example.TodoListProject.Service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    /**
     * 사용자 통계 정보 조회
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserStatsDto> getUserStats(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(rewardService.getUserStats(userId));
        } catch (IllegalArgumentException e) {
            // 존재하지 않는 사용자 등 잘못된 userId일 때 기본값 반환
            UserStatsDto defaultStats = UserStatsDto.builder()
                .id(null)
                .level(1)
                .exp(0)
                .nextLevelExp(100)
                .points(0)
                .totalCompleted(0)
                .totalFocusTime(0L)
                .streak(0)
                .build();
            return ResponseEntity.ok(defaultStats);
        }
    }

    /**
     * 할 일 완료 보상
     */
    @PostMapping("/todo-completed/{userId}")
    public ResponseEntity<UserStatsDto> rewardForCompletedTodo(
            @PathVariable String userId,
            @RequestBody Map<String, Object> payload
    ) {
        Integer difficulty = 1;
        if (payload.get("difficulty") != null) {
            Object diffObj = payload.get("difficulty");
            if (diffObj instanceof Integer) {
                difficulty = (Integer) diffObj;
            } else if (diffObj instanceof Number) {
                difficulty = ((Number) diffObj).intValue();
            }
        }
        return ResponseEntity.ok(rewardService.rewardForCompletedTodo(userId, difficulty));
    }

    /**
     * 할 일 완료 취소 처리 (완료 → 다른 상태)
     */
    @PostMapping("/todo-uncompleted/{userId}")
    public ResponseEntity<UserStatsDto> adjustForUncompletedTodo(
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(rewardService.adjustForUncompletedTodo(userId));
    }

    /**
     * 집중 시간 보상
     */
    @PostMapping("/focus-time/{userId}")
    public ResponseEntity<UserStatsDto> rewardForFocusTime(
            @PathVariable String userId,
            @RequestBody Map<String, Object> payload
    ) {
        Long focusTimeInSeconds = 0L;
        if (payload.get("focusTimeInSeconds") != null) {
            Object focusObj = payload.get("focusTimeInSeconds");
            if (focusObj instanceof Integer) {
                focusTimeInSeconds = ((Integer) focusObj).longValue();
            } else if (focusObj instanceof Number) {
                focusTimeInSeconds = ((Number) focusObj).longValue();
            }
        }
        return ResponseEntity.ok(rewardService.rewardForFocusTime(userId, focusTimeInSeconds));
    }

    /**
     * 업적 목록 조회
     */
    @GetMapping("/achievements/{userId}")
    public ResponseEntity<List<AchievementDto>> getAchievements(@PathVariable String userId) {
        return ResponseEntity.ok(rewardService.getAchievements(userId));
    }

    /**
     * 업적 보상 수령
     */
    @PostMapping("/claim-achievement/{userId}/{achievementId}")
    public ResponseEntity<?> claimAchievementReward(
            @PathVariable String userId,
            @PathVariable Long achievementId
    ) {
        try {
            UserStatsDto result = rewardService.claimAchievementReward(userId, achievementId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            // 잘못된 요청 파라미터 오류 (400)
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            // 그 외 서버 오류 (500)
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "업적 보상 수령 처리 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("status", 500);
            
            // 예외 로깅
            System.err.println("업적 보상 수령 API 오류: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 상점 아이템 목록 조회
     */
    @GetMapping("/shop-items/{userId}")
    public ResponseEntity<List<ShopItemDto>> getShopItems(@PathVariable String userId) {
        return ResponseEntity.ok(rewardService.getShopItems(userId));
    }

    /**
     * 아이템 구매
     */
    @PostMapping("/purchase-item/{userId}/{itemId}")
    public ResponseEntity<UserStatsDto> purchaseItem(
            @PathVariable String userId,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(rewardService.purchaseItem(userId, itemId));
    }

    /**
     * 아이템 활성화/비활성화
     */
    @PostMapping("/toggle-item/{userId}/{userItemId}")
    public ResponseEntity<Void> toggleItemActive(
            @PathVariable String userId,
            @PathVariable Long userItemId
    ) {
        rewardService.toggleItemActive(userId, userItemId);
        return ResponseEntity.ok().build();
    }
}