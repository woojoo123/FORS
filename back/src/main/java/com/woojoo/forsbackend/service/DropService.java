package com.woojoo.forsbackend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.woojoo.forsbackend.dto.DropDetailResponse;
import com.woojoo.forsbackend.dto.DropResponse;
import com.woojoo.forsbackend.dto.StockResponse;
import com.woojoo.forsbackend.entity.DropEventEntity;
import com.woojoo.forsbackend.repository.DropEventRepository;
import com.woojoo.forsbackend.repository.DropStockRepository;

@Service
public class DropService {

    private final DropEventRepository dropEventRepository;
    private final DropStockRepository dropStockRepository;

    public DropService(DropEventRepository dropEventRepository,
                       DropStockRepository dropStockRepository) {
        this.dropEventRepository = dropEventRepository;
        this.dropStockRepository = dropStockRepository;
    }

    public List<DropResponse> list() {
        return dropEventRepository.findAll().stream()
            .map(this::toDropResponse)
            .toList();
    }

    public DropDetailResponse detail(Long id) {
        DropEventEntity drop = dropEventRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "DROP_NOT_FOUND"));

        var stocks = dropStockRepository.findByDropEvent_Id(id).stream()
            .map(s -> new StockResponse(s.getSkuId(), s.getRemainingQty()))
            .toList();

        return new DropDetailResponse(
            drop.getId(),
            drop.getProduct().getName(),
            drop.getProduct().getBrand(),
            drop.getProduct().getPrice(),
            drop.getProduct().getImageUrl(),
            drop.getProduct().getDescription(),
            drop.getStatus(),
            drop.getStartsAt().toString(),
            drop.getEndsAt().toString(),
            dropStockRepository.sumRemainingQty(id),
            stocks
        );
    }

    private DropResponse toDropResponse(DropEventEntity drop) {
        return new DropResponse(
            drop.getId(),
            drop.getProduct().getName(),
            drop.getProduct().getBrand(),
            drop.getProduct().getPrice(),
            drop.getProduct().getImageUrl(),
            drop.getProduct().getDescription(),
            drop.getStatus(),
            drop.getStartsAt().toString(),
            drop.getEndsAt().toString(),
            dropStockRepository.sumRemainingQty(drop.getId())
        );
    }
}
