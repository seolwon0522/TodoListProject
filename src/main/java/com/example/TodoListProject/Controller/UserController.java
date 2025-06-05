package com.example.TodoListProject.Controller;

import com.example.TodoListProject.Dto.LoginRequestDto;
import com.example.TodoListProject.Dto.UserRequestDto;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
@Slf4j
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDto userRequestDto) {
        try {
            log.info("회원가입 요청: userId={}", userRequestDto.getUserId());
            UserResponseDto responseDto = userService.register(userRequestDto);
            log.info("회원가입 성공: userId={}", responseDto.getUserId());
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        try {
            log.info("로그인 시도: userId={}", loginDto.getUserId());
            UserResponseDto user = userService.login(loginDto, request, response);
            log.info("로그인 성공: userId={}", user.getUserId());

            Map<String, Object> result = new HashMap<>();
            result.put("message", "로그인 성공");
            result.put("user", user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            userService.logout(request, response);
            log.info("로그아웃 성공");
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            log.error("로그아웃 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                log.warn("인증되지 않은 사용자의 /me 요청");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인된 사용자가 없습니다");
            }
            log.info("현재 사용자 정보 요청: userId={}", userDetails.getUsername());
            UserResponseDto userResponseDto = userService.getCurrentUserByUserId(userDetails.getUsername());
            return ResponseEntity.ok(userResponseDto);
        } catch (Exception e) {
            log.error("현재 사용자 정보 조회 실패: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
