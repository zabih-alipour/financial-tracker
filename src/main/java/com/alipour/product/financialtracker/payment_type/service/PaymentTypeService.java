package com.alipour.product.financialtracker.payment_type.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.payment_type.repository.PaymentTypeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Service
@Transactional
public class PaymentTypeService extends CRUDService<PaymentType> {

    private final PaymentTypeRepository repository;

    public PaymentTypeService(PaymentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    protected JpaRepository<PaymentType, Long> getRepository() {
        return repository;
    }

    @Override
    public PaymentType add(PaymentType paymentType) {
        if (paymentType.getParent() != null) {
            paymentType.setPath(getPath(paymentType.getParent()));
        }
        return super.add(paymentType);
    }

    @Override
    public PaymentType edit(PaymentType paymentType) {
        PaymentType db_obj = repository.getOne(paymentType.getId());
        if (paymentType.getParent() == null) {
            paymentType.setPath(null);
        } else if (db_obj.getParent() == null ||
                !paymentType.getParent().getId().equals(db_obj.getParent().getId())) {
            paymentType.setPath(getPath(paymentType.getParent()));
        }

        return super.edit(paymentType);
    }

    private String getPath(PaymentType paymentType) {
        PaymentType parent = repository.getOne(paymentType.getId());
        return Optional.ofNullable(parent.getPath())
                .map(path -> path.concat("/"))
                .orElse("")
                .concat(parent.getId().toString());
    }
}