package com.alipour.product.financialtracker.investment.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class AssetSummaryDto implements Serializable {
    private String label;
    private BigDecimal amount;

    public AssetSummaryDto() {
    }

    public AssetSummaryDto(String label, BigDecimal amount) {
        this.label = label;
        this.amount = amount;
    }
}
