package com.alipour.product.financialtracker.type_price_history.controller;

import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.type_price_history.models.InvestmentTypePriceHistory;
import com.alipour.product.financialtracker.type_price_history.service.InvestmentTypePriceHistoryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-04-27 23:18:33
 */
@RestController
@RequestMapping("/type_price_history")
public class InvestmentTypePriceHistoryController extends CRUDController<InvestmentTypePriceHistory> {


    public InvestmentTypePriceHistoryController(InvestmentTypePriceHistoryService investmentTypePriceHistoryService) {
        super(investmentTypePriceHistoryService);
    }

}
