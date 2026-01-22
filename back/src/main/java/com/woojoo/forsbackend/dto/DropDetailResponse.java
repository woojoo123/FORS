package com.woojoo.forsbackend.dto;

import java.util.List;

public record DropDetailResponse(
    Long id,
    String name,
    String brand,
    Integer price,
    String imageUrl,
    String description,
    String status,
    String startsAt,
    String endsAt,
    Integer remainingQty,
    List<StockResponse> stocks
) {}
