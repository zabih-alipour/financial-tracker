package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.models.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, Long> {
}