package com.alipour.product.financialtracker.investment.dto;

import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
public class InvestmentDto extends ParentDto {
    private User user;
    private String shamsiDate;
    private Investment parent;
    private CoinInfo change;
    private CoinInfo subtract;

    public Investment getChangeInvestment() {
        return getInvestment(this.getChange());
    }

    public Investment getSubtractInvestment() {
        CoinInfo subtract = this.getSubtract();
        return getInvestment(subtract);
    }

    private Investment getInvestment(CoinInfo coin) {
        Investment investment = new Investment();
        investment.setUser(this.getUser());
        investment.setShamsiDate(this.getShamsiDate());
        investment.setParent(this.getParent());
        investment.setInvestmentType(coin.getInvestmentType());
        investment.setExecutedPrice(coin.getExecutedPrice());
        investment.setAmount(coin.getAmount());
        return investment;
    }
}
