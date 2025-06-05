package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.LoginRequestDto;
import com.example.TodoListProject.Dto.UserResponseDto;
import com.example.TodoListProject.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 인증 관련 API를 처리하는 컨트롤러
 * 프론트엔드에서 /api/auth/* 경로로 요청하는 API 처리
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
@Slf4j
public class AuthController {
    private final UserService userService;

    /**
     * 로그인 엔드포인트 - 스프링 시큐리티 세션 기반 인증 방식
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        try {
            log.info("[AuthController] 로그인 시도: userId={}", loginDto.getUserId());
            UserResponseDto user = userService.login(loginDto, request, response);
            log.info("[AuthController] 로그인 성공: userId={}", user.getUserId());
            Map<String, Object> result = new HashMap<>();
            result.put("message", "로그인 성공");
            result.put("user", user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("[AuthController] 로그인 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    /**
     * 현재 인증된 사용자 정보 조회 - 스프링 시큐리티 인증 컨텍스트 활용
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            log.warn("[AuthController] 인증되지 않은 사용자의 /me 요청");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다");
        }
        log.info("[AuthController] 현재 사용자 정보 조회: userId={}", userDetails.getUsername());
        try {
            UserResponseDto user = userService.getCurrentUserByUserId(userDetails.getUsername());
            log.info("[AuthController] 현재 사용자 정보 조회 성공: userId={}", user.getUserId());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("[AuthController] 현재 사용자 정보 조회 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 로그아웃은 스프링 시큐리티의 /logout 엔드포인트 사용
     */
    // 별도의 로그아웃 메서드 없이, 스프링 시큐리티의 /logout 엔드포인트를 사용하세요.
}
