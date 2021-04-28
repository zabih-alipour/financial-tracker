package com.alipour.product.financialtracker.payment_type.repository;

import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.payment_type.models.PaymentTypeUserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 存储库：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, Long> {
    @Query("select new com.alipour.product.financialtracker.payment_type.models.PaymentTypeUserDetail(" +
            "   p.user, " +
            "   sum(p.amount), " +
            "   sum(p.settlementAmount)) " +
            "from PaymentSearch p " +
            "where p.paymentType.id=:paymentTypeId " +
            "group by p.user.id")
    List<PaymentTypeUserDetail> detailsPerUser(@Param("paymentTypeId") Long paymentTypeId);
}