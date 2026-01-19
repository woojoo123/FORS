package com.woojoo.forsbackend.dto;

public record PayResponse(Long orderId, String orderStatus, String paymentStatus) {}
