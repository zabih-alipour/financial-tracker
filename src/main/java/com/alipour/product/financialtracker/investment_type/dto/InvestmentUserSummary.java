package com.alipour.product.financialtracker.investment_type.dto;

import com.alipour.product.financialtracker.user.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class InvestmentUserSummary {
    private User user;
    private BigDecimal amount;
    private BigDecimal spentAmount;
}
