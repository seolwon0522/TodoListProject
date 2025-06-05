package com.example.TodoListProject.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * 글로벌 예외 처리기 - JSON 응답 보장
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * 모든 예외를 JSON 형식으로 변환
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, HttpServletRequest request) {
        Map<String, Object> body = new HashMap<>();
        
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        // 예외 유형에 따라 상태 코드 결정
        if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (ex instanceof IllegalStateException) {
            status = HttpStatus.UNAUTHORIZED;
        }
        
        body.put("error", ex.getMessage());
        body.put("status", status.value());
        
        return ResponseEntity
                .status(status)
                .body(body);
    }
} 