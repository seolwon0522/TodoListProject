package com.example.TodoListProject.Repository;

import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Entity.UserPurchase;
import com.example.TodoListProject.Entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPurchaseRepository extends JpaRepository<UserPurchase, Long> {

    // 사용자의 모든 구매 기록 조회 (최신순)
    List<UserPurchase> findByUserOrderByPurchasedAtDesc(User user);


    // 사용자가 이미 구매한 아이템인지 확인
    boolean existsByUserAndShopItem(User user, ShopItem shopItem);

    // 사용자가 구매한 아이템 ID 목록
    @Query("SELECT up.shopItem.id FROM UserPurchase up WHERE up.user = :user")
    List<Long> findPurchasedItemIdsByUser(@Param("user") User user);
}