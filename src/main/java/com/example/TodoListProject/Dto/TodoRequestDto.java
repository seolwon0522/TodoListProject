package com.example.TodoListProject.Dto;

import com.example.TodoListProject.Enum.Status;
import lombok.Data;

@Data
public class TodoRequestDto{
    private String title;
    private String description;
    private Status status; // TODO, IN_PROGRESS, DONE
}