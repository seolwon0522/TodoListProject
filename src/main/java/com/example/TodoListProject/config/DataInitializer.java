package com.example.TodoListProject.config;

import com.example.TodoListProject.Entity.Achievement;
import com.example.TodoListProject.Entity.ShopItem;
import com.example.TodoListProject.Repository.AchievementRepository;
import com.example.TodoListProject.Repository.ShopItemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Profile("!test") // 테스트 환경에서는 실행하지 않음
public class DataInitializer {

    private final AchievementRepository achievementRepository;
    private final ShopItemRepository shopItemRepository;

    @PostConstruct
    public void initData() {
        initAchievements();
        initShopItems();
    }

    private void initAchievements() {
        // 기존 업적이 없을 경우에만 초기화
        if (achievementRepository.count() == 0) {
            List<Achievement> achievements = List.of(
                // 할일 완료 관련 업적
                Achievement.builder()
                    .title("시작이 반이다")
                    .description("할 일 1개 완료")
                    .icon("task_alt")
                    .points(10)
                    .exp(20)
                    .conditionType("todos_completed")
                    .conditionValue(1)
                    .build(),
                    
                Achievement.builder()
                    .title("하루하루 성실하게")
                    .description("할 일 10개 완료")
                    .icon("checklist")
                    .points(30)
                    .exp(50)
                    .conditionType("todos_completed")
                    .conditionValue(10)
                    .build(),
                    
                Achievement.builder()
                    .title("할 일 마스터")
                    .description("할 일 50개 완료")
                    .icon("verified")
                    .points(100)
                    .exp(200)
                    .conditionType("todos_completed")
                    .conditionValue(50)
                    .build(),
                
                // 집중 시간 관련 업적
                Achievement.builder()
                    .title("집중의 시작")
                    .description("10분 집중")
                    .icon("hourglass_bottom")
                    .points(10)
                    .exp(20)
                    .conditionType("focus_time")
                    .conditionValue(600) // 600초 = 10분
                    .build(),
                    
                Achievement.builder()
                    .title("집중력 향상")
                    .description("1시간 집중")
                    .icon("timer")
                    .points(50)
                    .exp(100)
                    .conditionType("focus_time")
                    .conditionValue(3600) // 3600초 = 1시간
                    .build(),
                    
                Achievement.builder()
                    .title("집중 마스터")
                    .description("5시간 집중")
                    .icon("schedule")
                    .points(200)
                    .exp(400)
                    .conditionType("focus_time")
                    .conditionValue(18000) // 18000초 = 5시간
                    .build(),
                
                // 연속 달성 관련 업적
                Achievement.builder()
                    .title("꾸준함의 시작")
                    .description("3일 연속 할 일 완료")
                    .icon("today")
                    .points(30)
                    .exp(50)
                    .conditionType("streak")
                    .conditionValue(3)
                    .build(),
                    
                Achievement.builder()
                    .title("습관의 형성")
                    .description("7일 연속 할 일 완료")
                    .icon("calendar_month")
                    .points(70)
                    .exp(150)
                    .conditionType("streak")
                    .conditionValue(7)
                    .build(),
                    
                Achievement.builder()
                    .title("의지의 달인")
                    .description("30일 연속 할 일 완료")
                    .icon("event_available")
                    .points(300)
                    .exp(500)
                    .conditionType("streak")
                    .conditionValue(30)
                    .build()
            );
            
            achievementRepository.saveAll(achievements);
        }
    }

    private void initShopItems() {
        // 기존 상점 아이템이 없을 경우에만 초기화
        if (shopItemRepository.count() == 0) {
            List<ShopItem> shopItems = List.of(
                // 테마 아이템
                ShopItem.builder()
                    .name("다크 테마")
                    .description("어두운 색상의 테마로 변경합니다.")
                    .price(100)
                    .itemType("theme")
                    .itemCode("dark_theme")
                    .build(),
                    
                ShopItem.builder()
                    .name("블루 테마")
                    .description("푸른색 계열의 테마로 변경합니다.")
                    .price(100)
                    .itemType("theme")
                    .itemCode("blue_theme")
                    .build(),
                    
                ShopItem.builder()
                    .name("그린 테마")
                    .description("녹색 계열의 테마로 변경합니다.")
                    .price(100)
                    .itemType("theme")
                    .itemCode("green_theme")
                    .build(),
                
                // 기능 아이템
                ShopItem.builder()
                    .name("일괄 삭제")
                    .description("완료된 할 일을 한 번에 삭제할 수 있습니다.")
                    .price(200)
                    .itemType("feature")
                    .itemCode("bulk_delete")
                    .build(),
                    
                ShopItem.builder()
                    .name("태그 시스템")
                    .description("할 일에 태그를 추가할 수 있습니다.")
                    .price(300)
                    .itemType("feature")
                    .itemCode("tag_system")
                    .build(),
                    
                ShopItem.builder()
                    .name("데이터 분석")
                    .description("할 일 완료 추이를 그래프로 확인할 수 있습니다.")
                    .price(500)
                    .itemType("feature")
                    .itemCode("data_analysis")
                    .build(),
                
                // 배지 아이템
                ShopItem.builder()
                    .name("초급자 배지")
                    .description("프로필에 초급자 배지를 표시합니다.")
                    .price(50)
                    .itemType("badge")
                    .itemCode("beginner_badge")
                    .build(),
                    
                ShopItem.builder()
                    .name("전문가 배지")
                    .description("프로필에 전문가 배지를 표시합니다.")
                    .price(200)
                    .itemType("badge")
                    .itemCode("expert_badge")
                    .build(),
                    
                ShopItem.builder()
                    .name("마스터 배지")
                    .description("프로필에 마스터 배지를 표시합니다.")
                    .price(500)
                    .itemType("badge")
                    .itemCode("master_badge")
                    .build()
            );
            
            shopItemRepository.saveAll(shopItems);
        }
    }
} 