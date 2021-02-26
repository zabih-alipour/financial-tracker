package com.alipour.product.financialtracker.payment.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.payment.dtos.PaymentReportDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentReportRepository;
import com.alipour.product.financialtracker.payment.repository.PaymentRepository;
import com.alipour.product.financialtracker.payment.views.PaymentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Service
public class PaymentService extends CRUDService<Payment> {

    private final PaymentRepository repository;
    private final PaymentReportRepository reportRepository;

    public PaymentService(PaymentRepository repository, PaymentReportRepository reportRepository) {
        this.repository = repository;
        this.reportRepository = reportRepository;
    }

    @Override
    public Payment add(Payment payment) {
        payment.setCode(UUID.randomUUID().getMostSignificantBits());
        return super.add(payment);
    }

    @Override
    protected JpaRepository<Payment, Long> getRepository() {
        return repository;
    }

    public Payment settlement(Long paymentId) {
        Payment copy = repository.getOne(paymentId).copy();
        return add(copy);
    }

    public Payment settlement(Long paymentId, BigDecimal amount) {
        Payment copy = repository.getOne(paymentId).copy();
        copy.setAmount(copy.getAmount().abs().subtract(amount));
        return add(copy);
    }

    public Set<PaymentReportDto> reports() {
        return reportRepository.findAll().stream()
                .collect(Collectors.groupingBy(PaymentReport::getUser))
                .entrySet().stream()
                .map(p -> {
                    List<PaymentReportDto.Detail> details = p.getValue().stream()
                            .map(val -> new PaymentReportDto.Detail(val.getType(), val.getAmount()))
                            .collect(Collectors.toList());
                    return new PaymentReportDto(p.getKey(), details);
                })
                .collect(Collectors.toSet());
    }
}