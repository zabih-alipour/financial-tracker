package com.alipour.product.financialtracker.payment.views;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Subselect("select * from vw_payment")
public class PaymentSearch extends ParentEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_of_payment"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_type_of_payment"))
    private PaymentType paymentType;

    @Column(name = "code", nullable = false)
    private Long code;

    @Column(name = "shamsi_date", nullable = false)
    private String shamsiDate;

    @CreationTimestamp
    private LocalDateTime created_at;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "payment_amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "settlement_amount", nullable = false)
    private BigDecimal settlementAmount;

    @Column(name = "is_settled")
    private Boolean settled;

}
