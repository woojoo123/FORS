package com.woojoo.forsbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.woojoo.forsbackend.entity.UserEntity;
import com.woojoo.forsbackend.entity.UserRoleEntity;
import com.woojoo.forsbackend.repository.UserRepository;
import com.woojoo.forsbackend.repository.UserRoleRepository;

import jakarta.transaction.Transactional;

@Component
public class AdminSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository,
                       UserRoleRepository userRoleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "admin@fors.local";
        
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return;  // 이미 있으면 스킵
        }

        UserEntity admin = new UserEntity();
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        UserEntity saved = userRepository.save(admin);

        UserRoleEntity adminRole = new UserRoleEntity();
        adminRole.setUser(saved);
        adminRole.setRole("ADMIN");
        userRoleRepository.save(adminRole);

        // 필요하면 USER도 같이
        UserRoleEntity userRole = new UserRoleEntity();
        userRole.setUser(saved);
        userRole.setRole("USER");
        userRoleRepository.save(userRole);
    }

}
