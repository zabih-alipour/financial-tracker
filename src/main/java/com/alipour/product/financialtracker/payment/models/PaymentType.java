package com.alipour.product.financialtracker.payment.models;

import com.alipour.product.financialtracker.common.ParentEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

/**
 * 实体类： *
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "payment_type")
public class PaymentType extends ParentEntity {

    @Column
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_parent_of_payment_type"))
    private PaymentType parent;

    @Column(name = "parent_path")
    private String path;
}