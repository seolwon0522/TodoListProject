package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.ShopItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopItemDto {
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String itemType;
    private String itemCode;
    private boolean purchased;

    // Entity를 DTO로 변환하는 메서드
    public static ShopItemDto fromEntity(ShopItem shopItem, boolean purchased) {
        return ShopItemDto.builder()
                .id(shopItem.getId())
                .name(shopItem.getName())
                .description(shopItem.getDescription())
                .price(shopItem.getPrice())
                .itemType(shopItem.getItemType())
                .itemCode(shopItem.getItemCode())
                .purchased(purchased)
                .build();
    }
} 