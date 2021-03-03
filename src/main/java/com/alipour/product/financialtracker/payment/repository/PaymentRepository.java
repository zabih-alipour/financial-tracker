package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    @Query("select p from Payment p " +
            "where p.user.id=:userId and p.paymentType.id=:typeId " +
            "order by p.shamsiDate")
    List<Payment> findByUserAndType(@Param("userId") Long userId, @Param("typeId") Long typeId);

    @Query("select p from Payment p " +
            "where p.user.id=:userId " +
            "order by p.shamsiDate")
    List<Payment> findByUserId(@Param("userId") Long userId);

    @Query("select p from Payment p " +
            "where p.paymentType.id=:typeId " +
            "order by p.shamsiDate")
    List<Payment> findByTypeId(@Param("typeId") Long typeId);
}