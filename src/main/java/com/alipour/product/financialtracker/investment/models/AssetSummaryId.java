package com.alipour.product.financialtracker.investment.models;

import lombok.Data;

import java.io.Serializable;

/**
 * 实体类： *
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */

@Data
public class AssetSummaryId implements Serializable {
    private Long userId;

    private Long investmentTypeId;

    public AssetSummaryId() {
    }

    public AssetSummaryId(Long userId, Long investmentTypeId) {
        this.userId = userId;
        this.investmentTypeId = investmentTypeId;
    }
}