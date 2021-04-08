package com.alipour.product.financialtracker.investment_type.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 实体类：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "investment_type_log")
public class InvestmentTypeLog extends ParentEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_investment_type"))
    private InvestmentType investmentType;

    @Column(name = "price")
    private BigDecimal latestPrice;

    @CreationTimestamp
    private LocalDateTime create_at;

    public InvestmentTypeLog(Long id) {
        super(id);
    }

    public InvestmentTypeLog() {
    }
}