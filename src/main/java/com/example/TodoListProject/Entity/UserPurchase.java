package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_purchases")
public class UserPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 구매한 아이템의 ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //구매한 아이템
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_item_id")
    private ShopItem shopItem;

    //구매시각
    @Builder.Default
    private LocalDateTime purchasedAt = LocalDateTime.now();


}
