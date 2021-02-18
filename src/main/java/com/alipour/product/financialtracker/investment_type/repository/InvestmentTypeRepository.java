package com.alipour.product.financialtracker.investment_type.repository;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@Repository
public interface InvestmentTypeRepository extends JpaRepository<InvestmentType, Long> {
}