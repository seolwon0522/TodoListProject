package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.TodoRequestDto;
import com.example.TodoListProject.Dto.TodoResponseDto;
import com.example.TodoListProject.Enum.Status;
import com.example.TodoListProject.Service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public TodoResponseDto createTodo(@RequestBody TodoRequestDto dto) {
        return todoService.createTodo(dto);
    }

    @GetMapping
    public List<TodoResponseDto> getAllTodos() {
        return todoService.getAllTodos();
    }

    @GetMapping("/{id}")
    public TodoResponseDto getTodo(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    @PutMapping("/{id}")
    public TodoResponseDto updateTodo(@PathVariable Long id, @RequestBody TodoRequestDto dto) {
        return todoService.updateTodo(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    // 칸반보드: 상태별 할 일 조회
    @GetMapping("/status/{status}")
    public List<TodoResponseDto> getTodosByStatus(@PathVariable Status status) {
        return todoService.getTodosByStatus(status);
    }

    // 칸반보드: 할 일 상태 변경
    @PatchMapping("/{id}/status")
    public TodoResponseDto updateTodoStatus(@PathVariable Long id, @RequestParam Status status) {
        return todoService.updateTodoStatus(id, status);
    }
}
