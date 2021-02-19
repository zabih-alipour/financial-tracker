package com.alipour.product.financialtracker.investment.repository;

import com.alipour.product.financialtracker.investment.models.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    @Query("select i from Investment i " +
            "where i.parent.id = :parentId")
    List<Investment> getByParentId(@Param("parentId") Long parentId);
}