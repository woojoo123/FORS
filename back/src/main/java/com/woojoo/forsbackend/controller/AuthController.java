package com.woojoo.forsbackend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woojoo.forsbackend.dto.SignupRequest;
import com.woojoo.forsbackend.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody SignupRequest req) {
        authService.signup(req);
        return ResponseEntity.ok().build();
    }
}
