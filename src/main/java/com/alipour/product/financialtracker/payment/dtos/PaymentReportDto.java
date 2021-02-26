package com.alipour.product.financialtracker.payment.dtos;

import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.user.models.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class PaymentReportDto extends ParentDto {
    private User user;
    private List<Detail> details;
    private Long sum;

    public PaymentReportDto(User user, List<Detail> details) {
        this.user = user;
        this.details = details;
        this.sum = details.stream()
                .map(Detail::getAmount)
                .mapToLong(BigDecimal::longValue)
                .sum();
    }

    @Data
    public static class Detail {
        private PaymentType type;
        private BigDecimal amount;

        public Detail(PaymentType type, BigDecimal amount) {
            this.type = type;
            this.amount = amount;
        }
    }
}
