package com.alipour.product.financialtracker.investment.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
