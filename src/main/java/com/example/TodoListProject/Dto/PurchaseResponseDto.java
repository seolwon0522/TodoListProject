package com.example.TodoListProject.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponseDto {
    private Boolean success; // 구매 성공 여부
    private String message; // 구매 결과 메시지
    private Long remainingPoints; // 구매 후 남은 포인트
    private String itemName; // 구매한 아이템 이름
    private Long purchasePrice; // 구매한 아이템 가격
}
