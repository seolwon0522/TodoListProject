package com.example.TodoListProject.config;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * 커스텀 에러 컨트롤러 - JSON 응답 보장
 */
@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping(value = "/error", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        // 에러 정보 추출
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        
        int statusCode = status != null ? Integer.parseInt(status.toString()) : 500;
        String errorMessage = message != null && !message.toString().isEmpty() 
                ? message.toString() 
                : "오류가 발생했습니다";
        
        // JSON 응답 생성
        Map<String, Object> body = new HashMap<>();
        body.put("error", errorMessage);
        body.put("status", statusCode);
        
        return ResponseEntity
                .status(statusCode)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
} 