package com.woojoo.forsbackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woojoo.forsbackend.dto.CreateOrderRequest;
import com.woojoo.forsbackend.dto.CreateOrderResponse;
import com.woojoo.forsbackend.dto.PayRequest;
import com.woojoo.forsbackend.dto.PayResponse;
import com.woojoo.forsbackend.entity.OrderEntity;
import com.woojoo.forsbackend.service.OrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping("/orders")
    public ResponseEntity<CreateOrderResponse> create(
            @RequestHeader(value="Idempotency-Key", required=true) String idemKey,
            @RequestBody CreateOrderRequest req
    ) {
        return ResponseEntity.ok(orderService.createOrder(req, idemKey));
    }

    @PostMapping("/orders/{orderId}/pay")
    public ResponseEntity<PayResponse> pay(
            @PathVariable Long orderId,
            @RequestBody PayRequest req
    ) {
        return ResponseEntity.ok(orderService.pay(orderId, req.result()));
    }

    @GetMapping("/orders/me")
    public ResponseEntity<List<OrderEntity>> myOrders(
        @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderEntity> myOrder(
        @RequestHeader("X-User-Id") Long userId,
        @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(orderService.getMyOrder(userId, orderId));
    }
}
