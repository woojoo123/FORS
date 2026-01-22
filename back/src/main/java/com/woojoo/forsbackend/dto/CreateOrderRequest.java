package com.woojoo.forsbackend.dto;

public record CreateOrderRequest(Long dropEventId, Long skuId, Integer amount) {}
