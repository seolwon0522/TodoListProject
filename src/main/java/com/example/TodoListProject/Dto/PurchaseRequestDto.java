package com.example.TodoListProject.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequestDto {
    private Long userId;
    private Long shopItemId; // 구매할 아이템의 ID
}
