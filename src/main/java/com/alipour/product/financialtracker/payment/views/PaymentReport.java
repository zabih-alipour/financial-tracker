package com.alipour.product.financialtracker.payment.views;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@EqualsAndHashCode(callSuper = true)
@Data
@Subselect("select " +
        "p.payment_type_id as id," +
        " p.user_id, " +
        "p.payment_type_id, " +
        "sum(p.amount) as amount " +
        "from payment p " +
        "group by p.user_id, p.payment_type_id ")
public class PaymentReport extends ParentEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id")
    private PaymentType type;

    @Column(name = "amount")
    private BigDecimal amount;
}
