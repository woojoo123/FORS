package com.woojoo.forsbackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.woojoo.forsbackend.dto.DropDetailResponse;
import com.woojoo.forsbackend.dto.DropResponse;
import com.woojoo.forsbackend.service.DropService;

@RestController
@RequestMapping("/api/drops")
public class DropController {

    private final DropService dropService;

    public DropController(DropService dropService) {
        this.dropService = dropService;
    }

    @GetMapping
    public ResponseEntity<List<DropResponse>> list() {
        return ResponseEntity.ok(dropService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DropDetailResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(dropService.detail(id));
    }
}
