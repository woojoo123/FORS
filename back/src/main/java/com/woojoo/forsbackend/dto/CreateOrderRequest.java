package com.woojoo.forsbackend.dto;

public record CreateOrderRequest(Long userId, Long dropEventId, Long skuId, Integer amount) {}
