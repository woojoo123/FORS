package com.woojoo.forsbackend.dto;

public record CreateOrderResponse(Long orderId, String status, String expiresAt) {}
