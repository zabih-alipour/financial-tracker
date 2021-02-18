package com.alipour.product.financialtracker.payment.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentRepository;
import com.alipour.product.financialtracker.payment_type.repository.PaymentTypeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

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
    protected JpaRepository<Payment, Long> getRepository() {
        return repository;
    }
}