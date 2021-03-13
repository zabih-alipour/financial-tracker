package com.alipour.product.financialtracker.investment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
@Slf4j
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

    @PostMapping("/search/v2")
    @ResponseBody
    public Page<VwInvestment> search(@RequestBody(required = false) SearchCriteria searchCriteria) {
        return ((InvestmentService) service).search(searchCriteria);
    }

    @GetMapping("/by-code/{userId}")
    @ResponseBody
    public List<VwInvestment> getByUser(@PathVariable("userId") Long userId) {
        return ((InvestmentService) service).getByUser(userId);
    }

    @GetMapping("/by-code/{userId}/{code}")
    @ResponseBody
    public List<VwInvestment> getByCode(@PathVariable("userId") Long userId, @PathVariable("code") String code) {
        return ((InvestmentService) service).getByUserAndCode(userId, code);
    }

    @GetMapping("/details/{id}")
    @ResponseBody
    public List<Investment> getByCode(@PathVariable("id") Long id) {
        return ((InvestmentService) service).getByParent(id);
    }
}
