package com.woojoo.forsbackend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.woojoo.forsbackend.entity.OrderEntity;

/* 
첫 번째 파라미터 = 엔티티 클래스 (이 레포지토리가 어느 테이블을 다루는지 보고 결정)
두 번째 파라미터 = 그 엔티티의 PK 타입 (엔티티 안의 @Id 필드 타입을 보고 결정)
*/
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByIdempotencyKey(String idempotencyKey);

    /* 
    pay()가 단순히 FAIL이면 +1 -> PAYMENT_PENDING → CANCELED로 상태가 실제로 변경된 경우에만 재고 +1
    */
    @Modifying
    @Transactional
    @Query("""
            UPDATE OrderEntity o
            SET o.status = 'CANCELED'
            WHERE o.id = :orderId
                AND o.status = 'PAYMENT_PENDING'
            """)
    int cancelIfPending(@Param("orderId") Long orderId);


    @Query("""
            SELECT o FROM OrderEntity o
            WHERE o.status = 'PAYMENT_PENDING'
            AND o.expiresAt < :now
            """)
            List<OrderEntity> findExpiredPending(@Param("now") LocalDateTime now);

    @Modifying
    @Transactional
    @Query("""
        UPDATE OrderEntity o
        SET o.status = 'EXPIRED'
        WHERE o.id = :orderId
            AND o.status = 'PAYMENT_PENDING'
    """)
    int expireIfPending(@Param("orderId") Long orderId);


    // 주문 상태가 PAYMENT_PENDING일 때만 PAID로 변경
    @Modifying
    @Transactional
    @Query("""
            UPDATE OrderEntity o
            SET o.status = 'PAID'
            WHERE o.id = :orderId
            AND o.status = 'PAYMENT_PENDING'
        """)
    int paidIfPending(@Param("orderId") Long orderId);

    // 내 주문목록을 최신순으로 가져옴
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    // 내 주문 상세를 나만 알 수 있게 함
    Optional<OrderEntity> findByIdAndUserId(Long id, Long userId);
}
