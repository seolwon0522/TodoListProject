package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.User;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String userId;
    private String userName;
    private Long totalFocusTime; // 총 집중시간 (초 단위)
    private Long currentPoints; // 현재 보유 포인트

    public static UserResponseDto fromEntity(User user){
        return UserResponseDto.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .userName(user.getUserName())
                .totalFocusTime(user.getTotalFocusTime())
                .currentPoints(user.getCurrentPoints())
                .build();
    }
}
