package com.woojoo.forsbackend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.woojoo.forsbackend.dto.SignupRequest;
import com.woojoo.forsbackend.entity.UserEntity;
import com.woojoo.forsbackend.entity.UserRoleEntity;
import com.woojoo.forsbackend.repository.UserRepository;
import com.woojoo.forsbackend.repository.UserRoleRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       UserRoleRepository userRoleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void signup(SignupRequest req) {
        userRepository.findByEmail(req.email()).ifPresent(u -> {
            throw new IllegalStateException("Email already exists");
        });

        UserEntity user = new UserEntity();
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        UserEntity saved = userRepository.save(user);

        UserRoleEntity role = new UserRoleEntity();
        role.setUser(saved);
        role.setRole("USER");
        userRoleRepository.save(role);
    }    
}
