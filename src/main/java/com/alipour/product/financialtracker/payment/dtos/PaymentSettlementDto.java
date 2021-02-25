package com.alipour.product.financialtracker.payment.dtos;

import com.alipour.product.financialtracker.common.ParentDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
public class PaymentSettlementDto extends ParentDto {
    private BigDecimal amount;
}
