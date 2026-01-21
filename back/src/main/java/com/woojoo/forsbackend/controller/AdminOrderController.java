package com.woojoo.forsbackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.woojoo.forsbackend.entity.OrderEntity;
import com.woojoo.forsbackend.service.OrderService;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    private final OrderService orderService;
    public AdminOrderController(OrderService orderService) { this.orderService = orderService; }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderEntity>> list(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @PostMapping("/orders/{id}/ship")
    public ResponseEntity<OrderEntity> ship(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.shipOrder(id));
    }
    
}
