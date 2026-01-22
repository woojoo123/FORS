package com.woojoo.forsbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.woojoo.forsbackend.entity.DropStockEntity;

public interface DropStockRepository extends JpaRepository<DropStockEntity, Long> {

    @Modifying
    @Transactional
    @Query("""
        UPDATE DropStockEntity s
        SET s.remainingQty = s.remainingQty - 1
        WHERE s.dropEventId = :dropEventId
          AND s.skuId = :skuId
          AND s.remainingQty > 0
    """)
    int decreaseIfAvailable(@Param("dropEventId") Long dropEventId,
                            @Param("skuId") Long skuId);

    @Modifying
    @Transactional
    @Query("""
        UPDATE DropStockEntity s
        SET s.remainingQty = s.remainingQty + 1
        WHERE s.dropEventId = :dropEventId
          AND s.skuId = :skuId
    """)
    int increase(@Param("dropEventId") Long dropEventId,
                 @Param("skuId") Long skuId);
                 
    @Query("SELECT COALESCE(SUM(s.remainingQty), 0) FROM DropStockEntity s WHERE s.dropEvent.id = :dropEventId")
    Integer sumRemainingQty(@Param("dropEventId") Long dropEventId);

    List<DropStockEntity> findByDropEventId(Long dropEventId);
}
