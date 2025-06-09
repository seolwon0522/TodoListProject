package com.example.TodoListProject;

import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Repository.TodoRepository;
import com.example.TodoListProject.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataMigration implements ApplicationRunner {

    private final UserRepository userRepository;
    private final TodoRepository todoRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        log.info("=== User totalFocusTime 마이그레이션 시작 ===");
        
        // 모든 사용자 조회
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            // 사용자의 모든 할 일의 집중시간 합계 계산
            List<Todo> userTodos = todoRepository.findByUser(user);
            long totalFocusTime = userTodos.stream()
                    .mapToLong(todo -> todo.getTotalFocusTime() != null ? todo.getTotalFocusTime() : 0L)
                    .sum();
            
            // User의 totalFocusTime 업데이트 (기존 값이 0이거나 null인 경우에만)
            if (user.getTotalFocusTime() == null || user.getTotalFocusTime() == 0L) {
                user.setTotalFocusTime(totalFocusTime);
                userRepository.save(user);
                log.info("사용자 ID: {}, 이름: {}, 총 집중시간: {}초로 업데이트", 
                        user.getId(), user.getUserName(), totalFocusTime);
            }
        }
        
        log.info("=== User totalFocusTime 마이그레이션 완료 ===");
    }
} 