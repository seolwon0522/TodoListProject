package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.UserPurchase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPurchaseDto {
    private Long id;
    private UserResponseDto user;
    private ShopItemDto shopItem;
    private LocalDateTime purchasedAt;

    public static UserPurchaseDto fromEntity(UserPurchase userPurchase) {
        return UserPurchaseDto.builder()
                .id(userPurchase.getId())
                .user(UserResponseDto.fromEntity(userPurchase.getUser()))
                .shopItem(ShopItemDto.builder()
                        .id(userPurchase.getShopItem().getId())
                        .itemName(userPurchase.getShopItem().getItemName())
                        .description(userPurchase.getShopItem().getDescription())
                        .price(userPurchase.getShopItem().getPrice())
                        .category(userPurchase.getShopItem().getCategory())
                        .isPurchased(true)
                        .canPurchase(false)
                        .build())
                .purchasedAt(userPurchase.getPurchasedAt())
                .build();
    }
}