package com.alipour.product.financialtracker.user.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Subselect("select * from vw_user_summary")
public class UserSummary extends ParentEntity {
    private String name;
    private BigDecimal assets;
    private BigDecimal balance;

}
