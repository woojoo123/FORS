package com.woojoo.forsbackend.dto;

public record DropResponse(
    Long id,
    String name,
    String brand,
    Integer price,
    String imageUrl,
    String description,
    String status,
    String startsAt,
    String endsAt,
    Integer remainingQty
) {}
