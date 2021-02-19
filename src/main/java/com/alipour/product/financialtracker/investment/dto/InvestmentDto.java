package com.alipour.product.financialtracker.investment.dto;

import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class InvestmentDto extends ParentDto {
    private User user;
    private String shamsiDate;
    private Investment parent;
    private Coin change;
    private Coin subtract;

    @Data
    public static class Coin {
        private Float amount;
        private Float executedPrice;
        private InvestmentType investmentType;
    }

    public Investment getChangeInvestment() {
        return getInvestment(this.getChange());
    }

    public Investment getSubtractInvestment() {
        Coin subtract = this.getSubtract();
        subtract.setAmount(-subtract.getAmount());
        return getInvestment(subtract);
    }

    private Investment getInvestment(Coin coin) {
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
