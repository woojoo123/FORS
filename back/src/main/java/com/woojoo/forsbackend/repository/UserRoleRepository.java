package com.woojoo.forsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woojoo.forsbackend.entity.UserRoleEntity;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, Long> {}
