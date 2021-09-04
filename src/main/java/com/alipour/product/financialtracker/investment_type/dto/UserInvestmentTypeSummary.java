package com.alipour.product.financialtracker.investment_type.dto;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserInvestmentTypeSummary {
    private InvestmentType type;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remain;

    public UserInvestmentTypeSummary(InvestmentType type, BigDecimal amount, BigDecimal spentAmount) {
        this.type = type;
        this.amount = amount;
        this.spentAmount = spentAmount;
        this.remain = amount.add(spentAmount != null ? spentAmount : BigDecimal.ZERO);
    }
}
