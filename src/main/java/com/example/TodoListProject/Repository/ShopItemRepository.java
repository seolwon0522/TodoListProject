package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.xml.namespace.QName;
import java.util.List;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    // 활성화된 아이템들만 조회 (카테고리별 정렬)
    List<ShopItem> findByIsActiveTrueOrderByCategory();

    // 카테고리별 활성화된 아이템 조회
    List<ShopItem> findByCategoryAndIsActiveTrueOrderByPrice(@Param("category") String category);

    // 사용자가 구매 가능한 아이템들 조회 (사용자 포인트 이하)
    @Query("SELECT si FROM ShopItem si WHERE si.price <= :userPoints AND si.isActive = true ORDER BY si.price")
    List<ShopItem> findAffordableItems(@Param("userPoints") Long userPoints);

    boolean existsByItemNameAndCategory(String itemName, String category);
}