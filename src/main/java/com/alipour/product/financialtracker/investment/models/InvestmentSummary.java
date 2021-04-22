package com.alipour.product.financialtracker.investment.models;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 实体类： *
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */

@Data
@Entity
@Subselect("select * from vw_asset_summary")
@IdClass(AssetSummaryId.class)
public class InvestmentSummary implements Serializable {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "investment_type_id")
    private Long investmentTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investment_type_id", insertable = false, updatable = false)
    private InvestmentType investmentType;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal amount;

}