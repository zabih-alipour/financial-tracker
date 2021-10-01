package com.alipour.product.financialtracker.investment_type.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;

/**
 * 实体类：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "investment_type")
public class InvestmentType extends ParentEntity {

    public static final InvestmentType RIAL = new InvestmentType(1L);
    public static final InvestmentType DOLOR = new InvestmentType(8L);
    public static final InvestmentType SETTLEMENT = new InvestmentType(12L);

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "latest_price")
    private BigDecimal latestPrice;

    @Column(name = "display_order", columnDefinition = "default 0")
    private BigDecimal displayOrder;

    public InvestmentType(Long id) {
        super(id);
    }

    public InvestmentType() {
    }

    public InvestmentType(Long id, String name) {
        super(id);
        this.name = name;

    }
}