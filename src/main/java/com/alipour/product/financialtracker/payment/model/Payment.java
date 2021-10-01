package com.alipour.product.financialtracker.payment.model;

import com.alipour.product.financialtracker.common.DateUtils;
import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment")
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Payment extends ParentEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_of_payment"))
    @NotNull(message = "کاربر نمی تواند خالی باشد")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_parent_of_payment"))
    private Payment parent;

    @Column(name = "amount", nullable = false)
    @Digits(message = "مبلغ باید عدد باشد", fraction = 10, integer = 20)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_type_of_payment"))
    @NotNull(message = "نوع پرداخت نمی تواند خالی باشد")
    private PaymentType paymentType;

    @Column(name = "shamsi_date", nullable = false)
    private String shamsiDate;

    @Column(name = "code", nullable = false)
    private Long code;

    @Column(name = "investment_code")
    private String investmentCode;

    @CreationTimestamp
    private LocalDateTime created_at;

    @Column(name = "description", nullable = false)
    private String description;

    public Payment settlement() {
        Payment payment = new Payment();
        payment.setPaymentType(this.getPaymentType());
        payment.setAmount(this.getAmount());
        payment.setUser(this.getUser());
        payment.setParent(this);
        payment.setShamsiDate(DateUtils.getTodayJalali());
        payment.setDescription(
                "تسویه "
                        .concat(this.getPaymentType().getName())
                        .concat("\n")
                        .concat("کد:")
                        .concat(getCode() + ""));
        return payment;
    }
}
