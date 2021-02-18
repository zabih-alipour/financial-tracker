package com.alipour.product.financialtracker.investment_type.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@RestController
@RequestMapping("/api/investment_types")
public class InvestmentTypeController extends CRUDController<InvestmentType> {

    public InvestmentTypeController(InvestmentTypeService service) {
        super(service);
    }
}
