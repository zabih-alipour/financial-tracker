package com.alipour.product.financialtracker.payment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.service.PaymentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController extends CRUDController<Payment> {

    public PaymentController(PaymentService paymentService) {
        super(paymentService);
    }
}
