package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shop_items")
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer price;

    // 아이템 타입 (theme, feature, badge, ...)
    @Column(nullable = false)
    private String itemType;

    // 아이템 코드 (실제 적용 시 사용할 코드)
    @Column(nullable = false)
    private String itemCode;
} 