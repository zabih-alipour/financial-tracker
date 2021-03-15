package com.alipour.product.financialtracker.investment.dto;

import lombok.Data;

import java.util.List;

@Data
public class InvestmentTotalReport {

    private List<InvestmentReport> reports;
    private List<CoinInfo> totals;

    public InvestmentTotalReport(List<InvestmentReport> reports, List<CoinInfo> totals) {
        this.reports = reports;
        this.totals = totals;
    }
}
