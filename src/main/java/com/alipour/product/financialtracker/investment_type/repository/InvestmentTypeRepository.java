package com.alipour.product.financialtracker.investment_type.repository;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.math.BigDecimal;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@Repository
public interface InvestmentTypeRepository extends JpaRepository<InvestmentType, Long>, JpaSpecificationExecutor<InvestmentType> {

    InvestmentType findByCode(String code);

    @Modifying
    @Query(value = "update investment_type set latest_price=:latestPrice where code=:code", nativeQuery = true)
    int updatePrice(@Param("code") String code, @Param("latestPrice") BigDecimal latestPrice);
}