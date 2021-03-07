package com.alipour.product.financialtracker.investment.repository;

import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
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
public interface VwInvestmentRepository extends JpaRepository<VwInvestment, Long>, JpaSpecificationExecutor<VwInvestment> {
}