package com.alipour.product.financialtracker.investment.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 实体类： *
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "investment")
public class Investment extends ParentEntity implements Cloneable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_of_investment"))
    private User user;

    @Column(name = "shamsi_date", nullable = false)
    private String shamsiDate;

    @Column(name = "amount", nullable = false)
    private Float amount;

    @Column(name = "executed_price", nullable = false)
    private Float executedPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_type_of_investment"))
    private InvestmentType investmentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_parent_of_investment"))
    private Investment parent;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "code", nullable = false)
    private String code;

    @CreationTimestamp
    private LocalDateTime create_at;

    @Transient
    private Float spendAmount;

    public Investment(Long id) {
        super(id);
    }

    public Investment() {
    }

    public Investment clone() {
        Investment investment = new Investment();
        investment.setInvestmentType(this.investmentType);
        investment.setUser(this.user);
        return investment;
    }
}