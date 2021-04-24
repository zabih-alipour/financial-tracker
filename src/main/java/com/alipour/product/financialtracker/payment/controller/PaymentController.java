package com.alipour.product.financialtracker.payment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.payment.dtos.PaymentReportDto;
import com.alipour.product.financialtracker.payment.dtos.PaymentSettlementDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.service.PaymentService;
import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @PostMapping("/settlement")
    @ResponseBody
    public Payment add(@RequestBody PaymentSettlementDto dto) {
        return ((PaymentService) service).settlement(dto);
    }

    @GetMapping("/reports")
    @ResponseBody
    public Set<PaymentReportDto> reports() {
        return ((PaymentService) service).reports();
    }

    @GetMapping("/{userId}/{typeId}")
    @ResponseBody
    public List<Payment> findByUserAndType(@PathVariable("userId") Long userId, @PathVariable("typeId") Long typeId) {
        return ((PaymentService) service).findByUserAndType(userId, typeId);
    }

    @GetMapping("/by-user/{userId}")
    @ResponseBody
    public List<Payment> findByUser(@PathVariable("userId") Long userId) {
        return ((PaymentService) service).findByUser(userId);
    }

    @GetMapping("/by-parent/{paymentId}")
    @ResponseBody
    public List<Payment> findByParent(@PathVariable("paymentId") Long paymentId) {
        return ((PaymentService) service).findByParent(paymentId);
    }

    @GetMapping("/by-type/{typeId}")
    @ResponseBody
    public List<Payment> findByType(@PathVariable("typeId") Long typeId) {
        return ((PaymentService) service).findByType(typeId);
    }

    @PostMapping("/search")
    @ResponseBody
    public Page<PaymentSearch> search(@RequestBody(required = false) SearchCriteria searchCriteria) {
        return ((PaymentService) service).search(searchCriteria);
    }
}
