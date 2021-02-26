package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.views.PaymentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentReportRepository extends JpaRepository<PaymentReport, Long> {

}