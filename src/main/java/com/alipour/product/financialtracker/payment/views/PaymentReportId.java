package com.alipour.product.financialtracker.payment.views;

import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;

import java.io.Serializable;

@Data
public class PaymentReportId implements Serializable {
    private User user;
    private PaymentType type;

    public PaymentReportId() {
    }

    public PaymentReportId(User user, PaymentType type) {
        this.user = user;
        this.type = type;
    }
}
