package com.alipour.product.financialtracker.type_price_history.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 实体类：
 *
 * @author Alipour
 * @date 2021-04-27 23:18:33
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "investment_type_price_history")
public class InvestmentTypePriceHistory extends ParentEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_type_id", nullable = false)
    private InvestmentType investmentType;

    @Column
    private BigDecimal latestPrice;

    @Column
    private LocalDateTime create_at;
}