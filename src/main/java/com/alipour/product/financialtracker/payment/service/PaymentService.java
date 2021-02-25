package com.alipour.product.financialtracker.payment.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentRepository;
import com.alipour.product.financialtracker.payment_type.repository.PaymentTypeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Service
public class PaymentService extends CRUDService<Payment> {

    private final PaymentRepository repository;
    private final PaymentTypeRepository typeRepository;

    public PaymentService(PaymentRepository repository, PaymentTypeRepository typeRepository) {
        this.repository = repository;
        this.typeRepository = typeRepository;
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
}