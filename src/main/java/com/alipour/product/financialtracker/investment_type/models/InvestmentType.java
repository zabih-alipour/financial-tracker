package com.alipour.product.financialtracker.investment_type.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

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

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "latest_price")
    private Float latestPrice;

    public InvestmentType(Long id) {
        super(id);
    }

    public InvestmentType() {
    }
}