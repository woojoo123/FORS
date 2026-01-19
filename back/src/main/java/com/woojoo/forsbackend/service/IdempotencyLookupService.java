package com.woojoo.forsbackend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.woojoo.forsbackend.entity.OrderEntity;
import com.woojoo.forsbackend.repository.OrderRepository;

@Service
public class IdempotencyLookupService {

    private final OrderRepository orderRepository;

    public IdempotencyLookupService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public Optional<OrderEntity> findByIdempotencyKey(String key) {
        // 실패한 insert 이후에도 조회가 가능하도록 별도 트랜잭션으로 실행한다.
        return orderRepository.findByIdempotencyKey(key);
    }
}
