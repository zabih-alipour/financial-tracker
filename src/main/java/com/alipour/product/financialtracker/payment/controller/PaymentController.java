package com.alipour.product.financialtracker.payment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.payment.dtos.PaymentReportDto;
import com.alipour.product.financialtracker.payment.dtos.PaymentSettlementDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.service.PaymentService;
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
        if (dto.getAmount() == null)
            return ((PaymentService) service).settlement(dto.getId());
        else return ((PaymentService) service).settlement(dto.getId(), dto.getAmount());
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
}
