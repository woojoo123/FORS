package com.woojoo.forsbackend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woojoo.forsbackend.dto.LoginRequest;
import com.woojoo.forsbackend.dto.MeResponse;
import com.woojoo.forsbackend.dto.SignupRequest;
import com.woojoo.forsbackend.repository.UserRepository;
import com.woojoo.forsbackend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final SecurityContextRepository securityContextRepository;
    private final UserRepository userRepository;
    
    public AuthController(AuthService authService,
                          AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          UserRepository userRepository) { 
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.userRepository = userRepository;
     }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignupRequest req) {
        authService.signup(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
        @RequestBody LoginRequest req,
        HttpServletRequest request,
        HttpServletResponse response
    )  {
    // 비밀번호 검증
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.email(), req.password())
    );

    // 로그인 결과(auth)를 SecurityContext에 넣기
    var context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(auth);
    SecurityContextHolder.setContext(context);

    // 그 로그인 정보를 "세션에 저장"해서 다음 요청에도 유지
    securityContextRepository.saveContext(context, request, response);

    return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("USER_NOT_FOUND"));

        String role = user.getRoles().stream()
            .findFirst()
            .map(r -> r.getRole())
            .orElse("USER");

        return ResponseEntity.ok(new MeResponse(user.getId(), user.getEmail(), role));
    } 
}
