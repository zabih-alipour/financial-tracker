package com.alipour.product.financialtracker.payment_type.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.payment_type.models.PaymentTypeUserDetail;
import com.alipour.product.financialtracker.payment_type.service.PaymentTypeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/users/{id}")
    public List<PaymentTypeUserDetail> typeUserDetails(@PathVariable("id") Long id) {
        return ((PaymentTypeService) service).detailsPerUser(id);
    }
}
