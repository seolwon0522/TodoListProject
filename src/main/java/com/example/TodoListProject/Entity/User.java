package com.example.TodoListProject.Entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "todo_users")
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String userPw;
    private String userName;
    
    // 총 집중 시간 (초 단위) - 사용자의 모든 할 일의 집중시간 합계
    @Builder.Default
    @Column(name = "total_focus_time")
    private Long totalFocusTime = 0L;
}
