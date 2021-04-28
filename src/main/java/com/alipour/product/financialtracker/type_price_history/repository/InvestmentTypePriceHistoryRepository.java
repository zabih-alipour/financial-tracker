package com.alipour.product.financialtracker.type_price_history.repository;

import com.alipour.product.financialtracker.type_price_history.models.InvestmentTypePriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-04-27 23:18:33
 */
@Repository
public interface InvestmentTypePriceHistoryRepository extends JpaRepository<InvestmentTypePriceHistory, Long> {
}