package com.woojoo.forsbackend.service;

import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.woojoo.forsbackend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService { 
    
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
                
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var authorities = user.getRoles().stream()
            .map(r -> "ROLE_" + r.getRole())  // Spring Security는 ROLE_ 접두사가 있어야 인식
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
        
        // Security가 사용할 “사용자 정보 객체”를 만들어서 반환.
        return new User(user.getEmail(), user.getPasswordHash(), authorities);
    }
}
