package com.alipour.product.financialtracker.investment.repository;

import com.alipour.product.financialtracker.investment.models.AssetSummaryId;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.models.InvestmentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@Repository
public interface AssetSummaryRepository extends JpaRepository<InvestmentSummary, Long> {
    @Query("select i from InvestmentSummary i where i.user.id = :userId")
    List<InvestmentSummary> findByUser(@Param("userId") Long userId);
}