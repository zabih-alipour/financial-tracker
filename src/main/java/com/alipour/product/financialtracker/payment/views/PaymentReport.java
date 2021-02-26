package com.alipour.product.financialtracker.payment.views;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@Subselect("select " +
        " p.user_id, " +
        "p.payment_type_id, " +
        "sum(p.amount) as amount " +
        "from payment p " +
        "group by p.user_id, p.payment_type_id ")
@IdClass(PaymentReportId.class)
public class PaymentReport implements Serializable {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id")
    private PaymentType type;

    @Column(name = "amount")
    private BigDecimal amount;
}
