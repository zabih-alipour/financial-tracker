package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.views.PaymentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface PaymentReportRepository extends JpaRepository<PaymentReport, Long> {

    Collection<PaymentReport> findByUserId(@Param("userId") Long userId);
}