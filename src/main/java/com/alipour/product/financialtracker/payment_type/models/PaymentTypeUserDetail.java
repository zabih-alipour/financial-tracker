package com.alipour.product.financialtracker.payment_type.models;

import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentTypeUserDetail {
    private User user;
    private BigDecimal amount;
    private BigDecimal settlementAmount;

    public PaymentTypeUserDetail(User user, BigDecimal amount, BigDecimal settlementAmount) {
        this.user = user;
        this.amount = amount;
        this.settlementAmount = settlementAmount;
    }
}
