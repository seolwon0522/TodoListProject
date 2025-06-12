package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shop_items")
public class ShopItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String itemName; // 아이템 이름
    private String description; // 아이템 설명
    private Long price; // 아이템 가격 (포인트 단위)
    private String category; // 아이템 카테고리

    @Builder.Default
    private Boolean isActive = true; // 아이템 활성화 여부
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now(); // 생성 시간


}
