package com.example.TodoListProject.Entity;

import com.example.TodoListProject.Enum.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "todo")
public class Todo {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private String description; // 할 일 상세 설명
    
    @Enumerated(EnumType.STRING)
    private Status status; // 할 일 상태 (TODO, IN_PROGRESS, DONE)

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
    
    // 총 집중 시간 (초 단위)
    @Builder.Default
    private Long totalFocusTime = 0L;
}
