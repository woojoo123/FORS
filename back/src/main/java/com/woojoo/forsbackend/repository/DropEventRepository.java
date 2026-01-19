package com.woojoo.forsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woojoo.forsbackend.entity.DropEventEntity;

public interface DropEventRepository extends JpaRepository<DropEventEntity, Long> {}