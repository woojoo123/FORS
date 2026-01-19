package com.woojoo.forsbackend.service;

import java.time.LocalDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.woojoo.forsbackend.dto.CreateOrderRequest;
import com.woojoo.forsbackend.dto.CreateOrderResponse;
import com.woojoo.forsbackend.dto.PayResponse;
import com.woojoo.forsbackend.entity.DropEventEntity;
import com.woojoo.forsbackend.entity.OrderEntity;
import com.woojoo.forsbackend.entity.PaymentEntity;
import com.woojoo.forsbackend.repository.DropEventRepository;
import com.woojoo.forsbackend.repository.DropStockRepository;
import com.woojoo.forsbackend.repository.OrderRepository;
import com.woojoo.forsbackend.repository.PaymentRepository;

@Service
public class OrderService {

    private final DropEventRepository dropEventRepository;

    private final OrderRepository orderRepository;
    private final DropStockRepository dropStockRepository;
    private final PaymentRepository paymentRepository;
    private final IdempotencyLookupService idempotencyLookupService;

    public OrderService(OrderRepository orderRepository,
                        DropStockRepository dropStockRepository,
                        PaymentRepository paymentRepository,
                        IdempotencyLookupService idempotencyLookupService, DropEventRepository dropEventRepository) {
        this.orderRepository = orderRepository;
        this.dropEventRepository = dropEventRepository;
        this.dropStockRepository = dropStockRepository;
        this.paymentRepository = paymentRepository;
        this.idempotencyLookupService = idempotencyLookupService;
    }

    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest req, String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IDEMPOTENCY_KEY_REQUIRED");
        }
        var existing = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            return toCreateOrderResponse(existing.get());
        }

                DropEventEntity dropEvent = dropEventRepository.findById(req.dropEventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "DROP_NOT_LIVE"));
        LocalDateTime now = LocalDateTime.now();
        if (!"LIVE".equals(dropEvent.getStatus())
                || dropEvent.getStartsAt() == null
                || dropEvent.getEndsAt() == null
                || now.isBefore(dropEvent.getStartsAt())
                || now.isAfter(dropEvent.getEndsAt())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "DROP_NOT_LIVE");
        }

        int updated = dropStockRepository.decreaseIfAvailable(req.dropEventId(), req.skuId());
        if (updated == 0) {
            throw new IllegalStateException("SOLD_OUT");
        }

        OrderEntity order = newOrderEntity(req, idempotencyKey);
        OrderEntity saved;
        try {
            saved = orderRepository.save(order);
        } catch (DataIntegrityViolationException e) {
            var existingFromNewTx = idempotencyLookupService.findByIdempotencyKey(idempotencyKey);
            if (existingFromNewTx.isPresent()) {
                return toCreateOrderResponse(existingFromNewTx.get());
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ALREADY_PURCHASED", e);
        }
        
        PaymentEntity payment = newPaymentEntity(saved, req);
        paymentRepository.save(payment);

        return new CreateOrderResponse(saved.getId(), saved.getStatus(), saved.getExpiresAt().toString());
    }

    @Transactional
    public PayResponse pay(Long orderId, String result) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("ORDER_NOT_FOUND"));

        PaymentEntity payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalStateException("PAYMENT_NOT_FOUND"));

        if ("PAID".equals(order.getStatus())) {
            return new PayResponse(orderId, order.getStatus(), payment.getStatus());
        }
        if ("CANCELED".equals(order.getStatus()) || "EXPIRED".equals(order.getStatus())) {
            return new PayResponse(orderId, order.getStatus(), payment.getStatus());
        }

        if ("SUCCEED".equalsIgnoreCase(result)) {
            order.setStatus("PAID");
            payment.setStatus("SUCCEEDED");
            return new PayResponse(orderId, order.getStatus(), payment.getStatus());
        }

        if ("FAIL".equalsIgnoreCase(result)) {
            int changed = orderRepository.cancelIfPending(orderId);

            if (changed == 1) {
                payment.setStatus("FAILED");
                dropStockRepository.increase(order.getDropEventId(), order.getSkuId());
            }
            return new PayResponse(orderId, order.getStatus(), payment.getStatus());
        }

        throw new IllegalArgumentException("INVALID_RESULT");
    }

    @Scheduled(fixedDelay = 60000)  // 1분마다
    @Transactional
    public void expirePendingOrders() {
        var now = LocalDateTime.now();
        var expiredList = orderRepository.findExpiredPending(now);

        for (var order : expiredList) {
            int changed = orderRepository.expireIfPending(order.getId());
            if (changed == 1) {
                dropStockRepository.increase(order.getDropEventId(), order.getSkuId());
            }
        }
    }

    private CreateOrderResponse toCreateOrderResponse(OrderEntity order) {
        return new CreateOrderResponse(order.getId(), order.getStatus(), order.getExpiresAt().toString());
    }

    private OrderEntity newOrderEntity(CreateOrderRequest req, String idempotencyKey) {
        OrderEntity order = new OrderEntity();
        order.setUserId(req.userId());
        order.setDropEventId(req.dropEventId());
        order.setSkuId(req.skuId());
        order.setStatus("PAYMENT_PENDING");
        order.setIdempotencyKey(idempotencyKey);
        order.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        return order;
    }

    private PaymentEntity newPaymentEntity(OrderEntity order, CreateOrderRequest req) {
        PaymentEntity payment = new PaymentEntity();
        payment.setOrderId(order.getId());
        payment.setStatus("INITIATED");
        payment.setAmount(req.amount() == null ? 0 : req.amount());
        return payment;
    }

}
