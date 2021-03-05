package com.alipour.product.financialtracker.investment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@RestController
@RequestMapping("/api/investments")
public class InvestmentController extends CRUDController<Investment> {
    public InvestmentController(InvestmentService investmentService) {
        super(investmentService);
    }

    @PostMapping("/v2")
    @ResponseBody
    public Investment add(@RequestBody InvestmentDto entity) {
        return ((InvestmentService) service).add(entity);
    }

    @PutMapping("/v2")
    @ResponseBody
    public Investment edit(@RequestBody InvestmentDto entity) {
        return ((InvestmentService) service).edit(entity);
    }

    @GetMapping("/by-code/{userId}/{code}")
    @ResponseBody
    public List<Investment> getByCode(@PathVariable("userId") Long userId, @PathVariable("code") Long code) {
        return ((InvestmentService) service).getByUserAndCode(userId, code);
    }
}
