package com.alipour.product.financialtracker.investment.dto;

import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;

import java.util.List;

@Data
public class InvestmentReport {
    private User user;
    private List<CoinInfo> coins;

    public InvestmentReport(User user, List<CoinInfo> coins) {
        this.user = user;
        this.coins = coins;
    }
}
