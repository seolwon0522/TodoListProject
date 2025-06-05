package com.example.TodoListProject.Service;

import com.example.TodoListProject.Dto.LoginRequestDto;
import com.example.TodoListProject.Dto.UserRequestDto;
import com.example.TodoListProject.Dto.UserResponseDto;
import com.example.TodoListProject.Entity.User;
import com.example.TodoListProject.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserResponseDto register(UserRequestDto userRequestDto){
        if(userRepository.existsByUserId(userRequestDto.getUserId())){
            throw new IllegalArgumentException("이미 존재하는 아이디입니다");
        }
        String encodedPassword = passwordEncoder.encode(userRequestDto.getUserPw());
        userRequestDto.setUserPw(encodedPassword);
        User savedUser = userRepository.save(userRequestDto.toEntity());
        return UserResponseDto.fromEntity(savedUser);
    }

    public UserResponseDto login(LoginRequestDto loginDto, HttpServletRequest request, HttpServletResponse response) {
        // 1. 인증 시도
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUserId(),
                        loginDto.getUserPw()
                )
        );

        // 2. SecurityContext 생성 및 인증 정보 세팅
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. 세션에 SecurityContext 저장 (Spring Security 6.x 필수)
        HttpSessionSecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);

        // 4. 사용자 정보 조회 및 반환
        User user = userRepository.findByUserId(loginDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        return UserResponseDto.fromEntity(user);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 세션 무효화
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();


    }

    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }



    public UserResponseDto getCurrentUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        return UserResponseDto.fromEntity(user);
    }
}
