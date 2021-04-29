package com.alipour.product.financialtracker.payment_type.models;

import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Optional;

@Data
public class UserPaymentTypeDetail {
    private PaymentType paymentType;
    private BigDecimal amount;
    private BigDecimal settlementAmount;
    private BigDecimal remain;

    public UserPaymentTypeDetail(PaymentType paymentType, BigDecimal amount, BigDecimal settlementAmount) {
        this.paymentType = paymentType;
        this.amount = amount;
        this.settlementAmount = settlementAmount;
        this.remain = Optional.ofNullable(amount).orElse(BigDecimal.ZERO)
                .add(Optional.ofNullable(settlementAmount).orElse(BigDecimal.ZERO));
    }
}
