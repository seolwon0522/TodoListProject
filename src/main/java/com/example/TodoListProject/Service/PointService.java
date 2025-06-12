package com.example.TodoListProject.Service;

import com.example.TodoListProject.Dto.PointResponseDto;
import com.example.TodoListProject.Entity.Point;
import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Repository.PointRepository;
import com.example.TodoListProject.Repository.TodoRepository;
import com.example.TodoListProject.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PointService {
    
    private final PointRepository pointRepository;
    private final UserRepository userRepository;
    
    // 1분(60초)당 1포인트
    private static final long SECONDS_PER_POINT = 60L;
    
    /**
     * 사용자의 현재 포인트 정보 조회
     */
    @Transactional(readOnly = true)
    public PointResponseDto getUserPoints(Long userId) {
        try {
            log.info("포인트 조회 시작 - 사용자 ID: {}", userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));
            
            log.info("사용자 조회 완료 - 사용자: {}, 현재 포인트: {}", user.getUserName(), user.getCurrentPoints());
            
            // 이미 포인트로 변환된 집중시간 계산 (히스토리 추적용)
            List<Point> userPoints = pointRepository.findByUserOrderByCreatedAtDesc(user);
            long totalFocusTimeUsed = userPoints.stream()
                    .mapToLong(Point::getFocusTimeUsed)
                    .sum();
            
            return PointResponseDto.builder()
                    .totalPoints(user.getCurrentPoints())
                    .totalFocusTimeUsed(totalFocusTimeUsed)
                    .newPointsEarned(0L)
                    .message("포인트 조회 완료")
                    .build();
        } catch (Exception e) {
            log.error("포인트 조회 중 오류 발생 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            throw new RuntimeException("포인트 조회 실패: " + e.getMessage(), e);
        }
    }
    
    /**
     * 포인트 계산 및 업데이트
     * 1. 사용자의 현재 총 집중시간 계산
     * 2. 이미 포인트로 변환된 시간 제외
     * 3. 새로운 집중시간에 대해 포인트 계산 및 기록
     */
    public PointResponseDto calculateAndUpdatePoints(Long userId) {
        try {
            log.info("포인트 계산 시작 - 사용자 ID: {}", userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));
            
            log.info("사용자 조회 완료 - 사용자: {}", user.getUserName());
            
            // 1. 사용자의 누적 총 집중시간 사용 (User 엔티티의 totalFocusTime)
            long currentTotalFocusTime = user.getTotalFocusTime() != null ? user.getTotalFocusTime() : 0L;
            
            // 2. 직접 계산 방식으로 이미 포인트로 변환된 집중시간 조회
            List<Point> userPoints = pointRepository.findByUserOrderByCreatedAtDesc(user);
            long alreadyUsedFocusTime = userPoints.stream()
                    .mapToLong(Point::getFocusTimeUsed)
                    .sum();
            
            // 3. 새로운 집중시간 계산
            long newFocusTime = currentTotalFocusTime - alreadyUsedFocusTime;
            
            // 4. 새로운 포인트 계산
            long newPoints = newFocusTime / SECONDS_PER_POINT;
            
            // 5. 실제 포인트로 변환되는 집중시간 계산 (60초 단위로 절삭)
            long actualUsedFocusTime = newPoints * SECONDS_PER_POINT;
            
            log.info("포인트 계산 - 현재 총 집중시간: {}초, 이미 사용된 시간: {}초, 새로운 시간: {}초, 새로운 포인트: {}, 실제 사용될 시간: {}초", 
                    currentTotalFocusTime, alreadyUsedFocusTime, newFocusTime, newPoints, actualUsedFocusTime);
            
            // 6. 새로운 포인트가 있으면 User 엔티티와 히스토리 업데이트
            if (newPoints > 0) {
                // User 포인트 업데이트
                user.setCurrentPoints(user.getCurrentPoints() + newPoints);
                userRepository.save(user);
                
                // 히스토리 기록 생성
                Point pointRecord = Point.builder()
                        .user(user)
                        .focusTimeUsed(actualUsedFocusTime)
                        .pointsEarned(newPoints)
                        .build();
                
                pointRepository.save(pointRecord);
                log.info("포인트 업데이트 완료 - 새 포인트: {}, 총 포인트: {}, 실제 사용된 시간: {}초", 
                        newPoints, user.getCurrentPoints(), actualUsedFocusTime);
            }
            
            // 7. 총 사용 시간 계산 (기존 + 새로 추가된 시간)
            long totalFocusTimeUsed = alreadyUsedFocusTime + (newPoints > 0 ? actualUsedFocusTime : 0);
            
            // 7. User 엔티티의 totalFocusTime는 이미 TodoService에서 업데이트되므로 별도 처리 불필요
            
            String message = newPoints > 0 ? 
                String.format("%d포인트를 획득했습니다! (새 집중시간: %d초)", newPoints, newFocusTime) : 
                "새로운 포인트가 없습니다.";
            
            log.info("포인트 계산 완료 - 총 포인트: {}, 총 사용 시간: {}초", user.getCurrentPoints(), totalFocusTimeUsed);
            
            return PointResponseDto.builder()
                    .totalPoints(user.getCurrentPoints())
                    .totalFocusTimeUsed(totalFocusTimeUsed)
                    .newPointsEarned(newPoints)
                    .message(message)
                    .build();
        } catch (Exception e) {
            log.error("포인트 계산 중 오류 발생 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            throw new RuntimeException("포인트 계산 실패: " + e.getMessage(), e);
        }
    }
    

    
    /**
     * 사용자의 포인트 획득 이력 조회
     */
    @Transactional(readOnly = true)
    public List<Point> getUserPointHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return pointRepository.findByUserOrderByCreatedAtDesc(user);
    }
} 