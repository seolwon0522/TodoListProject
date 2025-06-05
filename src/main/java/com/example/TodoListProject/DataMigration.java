package com.example.TodoListProject;

import com.example.TodoListProject.Entity.Todo;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Repository.TodoRepository;
import com.example.TodoListProject.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataMigration implements CommandLineRunner {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // 사용자 수 확인
        long userCount = userRepository.count();
        if (userCount == 0) {
            log.info("사용자가 없습니다. 데이터 마이그레이션을 건너뜁니다.");
            return;
        }

        // 사용자가 할당되지 않은 Todo 항목 찾기
        List<Todo> orphanedTodos = todoRepository.findAll().stream()
                .filter(todo -> todo.getUser() == null)
                .toList();

        if (orphanedTodos.isEmpty()) {
            log.info("마이그레이션이 필요한 Todo 항목이 없습니다.");
            return;
        }

        log.info("마이그레이션할 Todo 항목 수: {}", orphanedTodos.size());

        // 첫 번째 사용자 가져오기
        User firstUser = userRepository.findAll().stream()
                .findFirst()
                .orElse(null);

        if (firstUser == null) {
            log.error("사용자를 찾을 수 없습니다. 데이터 마이그레이션을 건너뜁니다.");
            return;
        }

        // 모든 Todo 항목을 첫 번째 사용자에게 할당
        for (Todo todo : orphanedTodos) {
            todo.setUser(firstUser);
            todoRepository.save(todo);
        }

        log.info("데이터 마이그레이션 완료: {} 개의 Todo 항목이 사용자 ID {}에 할당되었습니다.",
                orphanedTodos.size(), firstUser.getId());
    }
} 