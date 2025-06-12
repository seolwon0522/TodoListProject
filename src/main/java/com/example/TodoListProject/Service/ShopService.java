package com.example.TodoListProject.Service;

import com.example.TodoListProject.Dto.*;
import com.example.TodoListProject.Entity.*;
import com.example.TodoListProject.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Isolation;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ShopService {

    private final ShopItemRepository shopItemRepository;
    private final UserPurchaseRepository userPurchaseRepository;
    private final UserRepository userRepository;
    private final PointService pointService;

    /**
     * 모든 활성화된 상점 아이템 조회 (사용자별 구매 정보 포함)
     */
    @Transactional(readOnly = true)
    public List<ShopItemDto> getAllShopItems(Long userId) {
        User user = getUserById(userId);

        // 사용자의 현재 포인트 조회 (User 엔티티에서 직접)
        Long currentPoints = user.getCurrentPoints();

        // 사용자가 구매한 아이템 ID 목록
        List<Long> purchasedItemIds = userPurchaseRepository.findPurchasedItemIdsByUser(user);

        // 모든 활성화된 아이템 조회
        List<ShopItem> shopItems = shopItemRepository.findByIsActiveTrueOrderByCategory();

        return shopItems.stream()
                .map(item -> ShopItemDto.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .description(item.getDescription())
                        .price(item.getPrice())
                        .category(item.getCategory())
                        .isPurchased(purchasedItemIds.contains(item.getId()))
                        .canPurchase(currentPoints >= item.getPrice() && !purchasedItemIds.contains(item.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 카테고리별 상점 아이템 조회
     */
    @Transactional(readOnly = true)
    public List<ShopItemDto> getShopItemsByCategory(Long userId, String category) {
        User user = getUserById(userId);

        Long currentPoints = user.getCurrentPoints();

        List<Long> purchasedItemIds = userPurchaseRepository.findPurchasedItemIdsByUser(user);
        List<ShopItem> shopItems = shopItemRepository.findByCategoryAndIsActiveTrueOrderByPrice(category);

        return shopItems.stream()
                .map(item -> ShopItemDto.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .description(item.getDescription())
                        .price(item.getPrice())
                        .category(item.getCategory())
                        .isPurchased(purchasedItemIds.contains(item.getId()))
                        .canPurchase(currentPoints >= item.getPrice() && !purchasedItemIds.contains(item.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 아이템 구매 처리
     */
    public PurchaseResponseDto purchaseItem(PurchaseRequestDto request) {
        User user = getUserById(request.getUserId());
        ShopItem shopItem = getShopItemById(request.getShopItemId());

        // 아이템이 활성화되어 있는지 확인
        if (!shopItem.getIsActive()) {
            return createPurchaseResponse(false, "현재 판매하지 않는 아이템입니다.",
                    null, null, null);
        }

        // 이미 구매한 아이템인지 확인
        if (userPurchaseRepository.existsByUserAndShopItem(user, shopItem)) {
            return createPurchaseResponse(false, "이미 구매한 아이템입니다.",
                    null, shopItem.getItemName(), shopItem.getPrice());
        }

        // 사용자의 현재 포인트 확인
        Long currentPoints = user.getCurrentPoints();

        // 포인트 부족 확인
        if (currentPoints < shopItem.getPrice()) {
            return createPurchaseResponse(false,
                    String.format("포인트가 부족합니다. 필요: %d, 보유: %d", shopItem.getPrice(), currentPoints),
                    currentPoints, shopItem.getItemName(), shopItem.getPrice());
        }

        // 구매 기록 저장
        try {
            // 포인트 차감
            user.setCurrentPoints(currentPoints - shopItem.getPrice());
            userRepository.save(user);
            
            UserPurchase purchase = UserPurchase.builder()
                    .user(user)
                    .shopItem(shopItem)
                    .build();

            userPurchaseRepository.save(purchase);

            // 구매 후 남은 포인트
            Long remainingPoints = user.getCurrentPoints();

            log.info("아이템 구매 성공 - 사용자: {}, 아이템: {}, 가격: {}, 남은 포인트: {}",
                    user.getUserId(), shopItem.getItemName(), shopItem.getPrice(), remainingPoints);

            return createPurchaseResponse(true,
                    String.format("'%s' 아이템을 성공적으로 구매했습니다!", shopItem.getItemName()),
                    remainingPoints, shopItem.getItemName(), shopItem.getPrice());

        } catch (Exception e) {
            log.error("아이템 구매 실패 - 사용자: {}, 아이템: {}, 에러: {}",
                    user.getUserId(), shopItem.getItemName(), e.getMessage());

            return createPurchaseResponse(false, "구매 처리 중 오류가 발생했습니다.",
                    currentPoints, shopItem.getItemName(), shopItem.getPrice());
        }
    }

    /**
     * 사용자의 구매 기록 조회
     */
    @Transactional(readOnly = true)
    public List<UserPurchaseDto> getUserPurchaseHistory(Long userId) {
        User user = getUserById(userId);
        List<UserPurchase> purchases = userPurchaseRepository.findByUserOrderByPurchasedAtDesc(user);
        
        return purchases.stream()
                .map(UserPurchaseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 사용자가 구매 가능한 아이템들 조회
     */
    @Transactional(readOnly = true)
    public List<ShopItemDto> getAffordableItems(Long userId) {
        User user = getUserById(userId);

        Long currentPoints = user.getCurrentPoints();

        List<Long> purchasedItemIds = userPurchaseRepository.findPurchasedItemIdsByUser(user);
        List<ShopItem> affordableItems = shopItemRepository.findAffordableItems(currentPoints);

        return affordableItems.stream()
                .filter(item -> !purchasedItemIds.contains(item.getId())) // 이미 구매한 아이템 제외
                .map(item -> ShopItemDto.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .description(item.getDescription())
                        .price(item.getPrice())
                        .category(item.getCategory())
                        .isPurchased(false)
                        .canPurchase(true)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
    public void initializeShopData() {
        log.info("=== 상점 초기 데이터 생성 시작 ===");

        // 이미 데이터가 있으면 스킵
        if (shopItemRepository.count() > 0) {
            log.info("상점 데이터가 이미 존재합니다. 초기화를 스킵합니다.");
            return;
        }

        // 테마 카테고리 상품들
        createShopItem("다크 테마", "깔끔한 다크 모드 테마로 눈의 피로를 줄여보세요", 50L, "테마");
        createShopItem("파스텔 테마", "부드러운 파스텔 컬러의 따뜻한 테마", 80L, "테마");
        createShopItem("네온 테마", "화려한 네온 컬러의 역동적인 테마", 120L, "테마");
        createShopItem("미니멀 테마", "깔끔하고 단순한 미니멀 디자인 테마", 100L, "테마");

        // 스티커 카테고리 상품들
        createShopItem("완료 스티커팩", "할 일 완료 시 특별한 스티커 효과", 30L, "스티커");
        createShopItem("우수 스티커팩", "뛰어난 성과 달성 시 황금 스티커", 45L, "스티커");
        createShopItem("연속 달성 스티커", "연속 완료 시 특별 스티커 컬렉션", 60L, "스티커");
        createShopItem("시즌 한정 스티커", "계절별 특별 디자인 스티커팩", 90L, "스티커");

        // 아바타 카테고리 상품들
        createShopItem("골드 프로필 테두리", "반짝이는 골드 테두리로 프로필 꾸미기", 70L, "아바타");
        createShopItem("다이아몬드 배지", "최고 등급의 다이아몬드 배지", 150L, "아바타");
        createShopItem("특별 아이콘팩", "개성 넘치는 프로필 아이콘 모음", 85L, "아바타");
        createShopItem("VIP 타이틀", "VIP 전용 특별 타이틀 표시", 200L, "아바타");

        // 위젯 카테고리 상품들
        createShopItem("고급 진행률 표시기", "더욱 정확하고 예쁜 진행률 표시", 40L, "위젯");
        createShopItem("통계 대시보드", "상세한 통계와 분석 위젯", 110L, "위젯");
        createShopItem("집중 타이머 위젯", "고급 기능의 집중 타이머", 65L, "위젯");
        createShopItem("성과 분석 위젯", "개인 성과 분석 및 트렌드 위젯", 130L, "위젯");

        // 기능 카테고리 상품들
        createShopItem("할 일 우선순위 강조", "중요한 할 일을 시각적으로 강조", 35L, "기능");
        createShopItem("자동 백업 기능", "데이터 자동 백업 및 복원 기능", 95L, "기능");
        createShopItem("고급 알림 설정", "맞춤형 알림 및 리마인더 기능", 55L, "기능");
        createShopItem("팀 협업 기능", "팀원과 함께하는 협업 기능", 180L, "기능");
        createShopItem("고급 필터링 기능", "할 일을 다양한 조건으로 필터링", 75L, "기능");

        // 모든 변경사항을 강제로 데이터베이스에 반영
        shopItemRepository.flush();
        
        log.info("=== 상점 초기 데이터 생성 완료 ===");
        log.info("총 20개의 상품이 생성되었습니다.");
    }

    private void createShopItem(String itemName, String description, Long price, String category) {
        ShopItem shopItem = ShopItem.builder()
                .itemName(itemName)
                .description(description)
                .price(price)
                .category(category)
                .isActive(true)
                .build();

        shopItemRepository.save(shopItem);
        log.info("상품 생성: {} - {}포인트 ({})", itemName, price, category);
    }

    // === 헬퍼 메서드들 ==

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));
    }

    private ShopItem getShopItemById(Long shopItemId) {
        return shopItemRepository.findById(shopItemId)
                .orElseThrow(() -> new IllegalArgumentException("상점 아이템을 찾을 수 없습니다. ID: " + shopItemId));
    }

    private PurchaseResponseDto createPurchaseResponse(Boolean success, String message,
                                                       Long remainingPoints, String itemName, Long purchasePrice) {
        return PurchaseResponseDto.builder()
                .success(success)
                .message(message)
                .remainingPoints(remainingPoints)
                .itemName(itemName)
                .purchasePrice(purchasePrice)
                .build();
    }
}