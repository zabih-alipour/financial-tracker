package com.alipour.product.financialtracker.user.repositories;

import com.alipour.product.financialtracker.payment_type.models.PaymentTypeUserDetail;
import com.alipour.product.financialtracker.payment_type.models.UserPaymentTypeDetail;
import com.alipour.product.financialtracker.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select new com.alipour.product.financialtracker.payment_type.models.UserPaymentTypeDetail(" +
            "   p.paymentType, " +
            "   sum(p.amount), " +
            "   sum(p.settlementAmount)) " +
            "from PaymentSearch p " +
            "where p.user.id=:userId " +
            "group by p.paymentType.id")
    List<UserPaymentTypeDetail> userPaymentTypeDetail(@Param("userId") Long userId);
}
