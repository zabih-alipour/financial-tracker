package com.alipour.product.financialtracker.payment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.payment.models.PaymentType;
import com.alipour.product.financialtracker.payment.service.PaymentTypeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@RestController
@RequestMapping("/api/paymentTypes")
public class PaymentTypeController extends CRUDController<PaymentType> {

    public PaymentTypeController(PaymentTypeService paymentTypeService) {
        super(paymentTypeService);
    }
}
