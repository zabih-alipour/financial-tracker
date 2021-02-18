package com.alipour.product.financialtracker.payment.model;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Payment extends ParentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_of_payment"))
    private User user;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_type_of_payment"))
    private PaymentType paymentType;

    @Column(name = "shamsi_date", nullable = false)
    private String shamsiDate;

    @CreationTimestamp
    private LocalDateTime created_at;

    @Column(name = "description", nullable = false)
    private String description;
}
