package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentSearchRepository extends JpaRepository<PaymentSearch, Long>, JpaSpecificationExecutor<PaymentSearch> {

}