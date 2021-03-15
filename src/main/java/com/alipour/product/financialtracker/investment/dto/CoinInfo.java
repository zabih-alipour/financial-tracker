package com.alipour.product.financialtracker.investment.dto;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CoinInfo {
    private InvestmentType investmentType;
    private BigDecimal amount;
    private BigDecimal executedPrice;

    public CoinInfo() {
    }

    public CoinInfo(InvestmentType investmentType, BigDecimal amount) {
        this.investmentType = investmentType;
        this.amount = amount;
    }

    public CoinInfo(InvestmentType investmentType, BigDecimal amount, BigDecimal executedPrice) {
        this.investmentType = investmentType;
        this.amount = amount;
        this.executedPrice = executedPrice;
    }
}
