package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.PointResponseDto;
import com.example.TodoListProject.Entity.Point;
import com.example.TodoListProject.Service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/points")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
@Slf4j
public class PointController {
    
    private final PointService pointService;
    
    /**
     * 사용자의 현재 포인트 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<PointResponseDto> getUserPoints(@PathVariable Long userId) {
        try {
            log.info("포인트 조회 요청 - 사용자 ID: {}", userId);
            PointResponseDto response = pointService.getUserPoints(userId);
            log.info("포인트 조회 성공 - 사용자 ID: {}, 총 포인트: {}", userId, response.getTotalPoints());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("포인트 조회 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(PointResponseDto.builder()
                            .totalPoints(0L)
                            .totalFocusTimeUsed(0L)
                            .newPointsEarned(0L)
                            .message("포인트 조회 실패: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * 사용자의 집중 시간 기반 포인트 계산 및 업데이트
     */
    @PostMapping("/{userId}/calculate")
    public ResponseEntity<PointResponseDto> calculateAndUpdatePoints(@PathVariable Long userId) {
        try {
            log.info("포인트 계산 요청 - 사용자 ID: {}", userId);
            PointResponseDto response = pointService.calculateAndUpdatePoints(userId);
            log.info("포인트 계산 성공 - 사용자 ID: {}, 새 포인트: {}, 총 포인트: {}", 
                    userId, response.getNewPointsEarned(), response.getTotalPoints());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("포인트 계산 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(PointResponseDto.builder()
                            .totalPoints(0L)
                            .totalFocusTimeUsed(0L)
                            .newPointsEarned(0L)
                            .message("포인트 계산 실패: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * 사용자의 포인트 획득 이력 조회
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<Point>> getUserPointHistory(@PathVariable Long userId) {
        try {
            log.info("포인트 이력 조회 요청 - 사용자 ID: {}", userId);
            List<Point> history = pointService.getUserPointHistory(userId);
            log.info("포인트 이력 조회 성공 - 사용자 ID: {}, 기록 수: {}", userId, history.size());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("포인트 이력 조회 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
} 