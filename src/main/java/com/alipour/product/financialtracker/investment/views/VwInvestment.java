package com.alipour.product.financialtracker.investment.views;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.user.models.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Entity
@Subselect("select * from vw_investment")
@Data
public class VwInvestment extends ParentEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_type_id")
    private InvestmentType investmentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Investment investment;

    @Column(name = "code")
    private String code;

    @Column(name = "shamsi_date")
    private String shamsiDate;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "executed_price")
    private Float executedPrice;

    @Column(name = "spent_amount")
    private BigDecimal spentAmount;

    @JsonProperty
    public BigDecimal getRemain() {
        return getAmount().add(getSpentAmount() != null ? getSpentAmount() : BigDecimal.ZERO);
    }

}
