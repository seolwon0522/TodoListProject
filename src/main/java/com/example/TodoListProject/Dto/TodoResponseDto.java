package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TodoResponseDto {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Long totalFocusTime;

    public static TodoResponseDto fromEntity(Todo todo){
        return new TodoResponseDto(
            todo.getId(), 
            todo.getTitle(), 
            todo.getDescription(), 
            todo.getStatus(),
            todo.getTotalFocusTime() != null ? todo.getTotalFocusTime() : 0L
        );
    }
}