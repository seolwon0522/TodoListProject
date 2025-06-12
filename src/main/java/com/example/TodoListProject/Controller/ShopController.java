package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.ShopItemDto;
import com.example.TodoListProject.Dto.PurchaseRequestDto;
import com.example.TodoListProject.Dto.PurchaseResponseDto;
import com.example.TodoListProject.Dto.UserPurchaseDto;
import com.example.TodoListProject.Service.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shop")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
@Slf4j
public class ShopController {
    private final ShopService shopService;

    // 모든 상점 아이템 조회(사용자별)
    @GetMapping("/items/{userId}")
    public ResponseEntity<List<ShopItemDto>> getAllShopItems(@PathVariable Long userId) {
        try {
            log.info("상점 아이템 조회 요청 - 사용자 ID: {}", userId);
            List<ShopItemDto> shopItems = shopService.getAllShopItems(userId);
            log.info("상점 아이템 조회 성공 - 사용자 ID: {}, 아이템 수: {}", userId, shopItems.size());
            return ResponseEntity.ok(shopItems);
        } catch (Exception e) {
            log.error("상점 아이템 조회 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    // 카테고리별 상점 아이템 조회
    @GetMapping("/items/{userId}/category/{category}")
    public ResponseEntity<List<ShopItemDto>> getShopItemsByCategory(
            @PathVariable Long userId, 
            @PathVariable String category) {
        try {
            log.info("카테고리별 상점 아이템 조회 요청 - 사용자 ID: {}, 카테고리: {}", userId, category);
            List<ShopItemDto> shopItems = shopService.getShopItemsByCategory(userId, category);
            log.info("카테고리별 상점 아이템 조회 성공 - 사용자 ID: {}, 카테고리: {}, 아이템 수: {}", 
                    userId, category, shopItems.size());
            return ResponseEntity.ok(shopItems);
        } catch (Exception e) {
            log.error("카테고리별 상점 아이템 조회 실패 - 사용자 ID: {}, 카테고리: {}, 오류: {}", 
                    userId, category, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    // 아이템 구매
    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponseDto> purchaseItem(@RequestBody PurchaseRequestDto request) {
        try {
            log.info("아이템 구매 요청 - 사용자 ID: {}, 아이템 ID: {}", 
                    request.getUserId(), request.getShopItemId());
            PurchaseResponseDto response = shopService.purchaseItem(request);
            
            if (response.getSuccess()) {
                log.info("아이템 구매 성공 - 사용자 ID: {}, 아이템: {}, 가격: {}포인트", 
                        request.getUserId(), response.getItemName(), response.getPurchasePrice());
                return ResponseEntity.ok(response);
            } else {
                log.warn("아이템 구매 실패 - 사용자 ID: {}, 사유: {}", 
                        request.getUserId(), response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("아이템 구매 처리 실패 - 사용자 ID: {}, 아이템 ID: {}, 오류: {}", 
                    request.getUserId(), request.getShopItemId(), e.getMessage(), e);
            PurchaseResponseDto errorResponse = PurchaseResponseDto.builder()
                    .success(false)
                    .message("구매 처리 중 시스템 오류가 발생했습니다.")
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // 사용자 구매 기록 조회
    @GetMapping("/purchases/{userId}")
    public ResponseEntity<List<UserPurchaseDto>> getUserPurchaseHistory(@PathVariable Long userId) {
        try {
            log.info("사용자 구매 기록 조회 요청 - 사용자 ID: {}", userId);
            List<UserPurchaseDto> purchases = shopService.getUserPurchaseHistory(userId);
            log.info("사용자 구매 기록 조회 성공 - 사용자 ID: {}, 구매 기록 수: {}", userId, purchases.size());
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            log.error("사용자 구매 기록 조회 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    // 구매 가능한 아이템들 조회 (사용자 포인트로 구매할 수 있는 아이템들)
    @GetMapping("/affordable/{userId}")
    public ResponseEntity<List<ShopItemDto>> getAffordableItems(@PathVariable Long userId) {
        try {
            log.info("구매 가능 아이템 조회 요청 - 사용자 ID: {}", userId);
            List<ShopItemDto> affordableItems = shopService.getAffordableItems(userId);
            log.info("구매 가능 아이템 조회 성공 - 사용자 ID: {}, 구매 가능 아이템 수: {}", 
                    userId, affordableItems.size());
            return ResponseEntity.ok(affordableItems);
        } catch (Exception e) {
            log.error("구매 가능 아이템 조회 실패 - 사용자 ID: {}, 오류: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}
