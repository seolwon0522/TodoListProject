package com.example.TodoListProject.Service;

import com.example.TodoListProject.Dto.TodoRequestDto;
import com.example.TodoListProject.Dto.TodoResponseDto;
import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Enum.Status;
import com.example.TodoListProject.Repository.TodoRepository;
import com.example.TodoListProject.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // 인증된 사용자 조회
    private User getCurrentUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다"));
    }

    // 할 일 생성
    public TodoResponseDto createTodo(TodoRequestDto dto) {
        User user = getCurrentUser();
        Todo todo = new Todo();
        todo.setTitle(dto.getTitle());
        todo.setDescription(dto.getDescription());
        todo.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.TODO); // 기본값은 TODO
        todo.setUser(user);
        return TodoResponseDto.fromEntity(todoRepository.save(todo));
    }

    // 내 할 일 전체 조회

    public List<TodoResponseDto> getAllTodos() {
        User user = getCurrentUser();
        return todoRepository.findByUser(user).stream()
                .map(TodoResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 할 일 조회

    public TodoResponseDto getTodoById(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 할 일을 찾을 수 없거나 접근 권한이 없습니다."));
        return TodoResponseDto.fromEntity(todo);
    }

    // 할 일 수정
    public TodoResponseDto updateTodo(Long id, TodoRequestDto dto) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 할 일을 찾을 수 없거나 접근 권한이 없습니다."));
        todo.setTitle(dto.getTitle());
        todo.setDescription(dto.getDescription());
        todo.setStatus(dto.getStatus());
        return TodoResponseDto.fromEntity(todoRepository.save(todo));
    }

    // 할 일 삭제
    public void deleteTodo(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 할 일을 찾을 수 없거나 접근 권한이 없습니다."));
        
        // TODO 삭제 시 사용자의 총 집중시간은 유지됨 (누적 집중시간이므로 감소하지 않음)
        // 포인트 계산은 Points 테이블의 이력을 기반으로 별도 처리
        todoRepository.delete(todo);
    }

    // 칸반보드: 상태별 할 일 조회
    public List<TodoResponseDto> getTodosByStatus(Status status) {
        User user = getCurrentUser();
        return todoRepository.findByUserAndStatus(user, status).stream()
                .map(TodoResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 칸반보드: 할 일 상태 변경
    public TodoResponseDto updateTodoStatus(Long id, Status newStatus) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 할 일을 찾을 수 없거나 접근 권한이 없습니다."));
        todo.setStatus(newStatus);
        return TodoResponseDto.fromEntity(todoRepository.save(todo));
    }

    // 할 일의 집중 시간 업데이트
    public TodoResponseDto updateTodoFocusTime(Long id, Long focusTimeInSeconds) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 할 일을 찾을 수 없거나 접근 권한이 없습니다."));
        
        // 이전 집중시간과 새로운 집중시간의 차이 계산
        Long previousFocusTime = todo.getTotalFocusTime() != null ? todo.getTotalFocusTime() : 0L;
        Long focusTimeDifference = focusTimeInSeconds - previousFocusTime;
        
        // Todo의 집중시간 업데이트
        todo.setTotalFocusTime(focusTimeInSeconds);
        Todo savedTodo = todoRepository.save(todo);
        
        // User의 총 집중시간 업데이트 (차이만큼 더하기)
        if (focusTimeDifference != 0) {
            user.setTotalFocusTime((user.getTotalFocusTime() != null ? user.getTotalFocusTime() : 0L) + focusTimeDifference);
            userRepository.save(user);
        }
        
        return TodoResponseDto.fromEntity(savedTodo);
    }
}
