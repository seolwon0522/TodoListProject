package com.example.TodoListProject.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopItemDto {
    private Long id;
    private String itemName; // 아이템 이름
    private String description; // 아이템 설명
    private Long price; // 아이템 가격 (포인트 단위)
    private String category; // 아이템 카테고리
    private Boolean isPurchased; // 아이템 구매 여부
    private Boolean canPurchase; // 아이템 구매 가능 여부
}
