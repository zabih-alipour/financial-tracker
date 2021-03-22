package com.alipour.product.financialtracker.investment_type.controller;

import com.alipour.product.financialtracker.api_caller.CoinexApiCaller;
import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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
    private final CoinexApiCaller apiCaller;

    public InvestmentTypeController(InvestmentTypeService service, CoinexApiCaller apiCaller) {
        super(service);
        this.apiCaller = apiCaller;
    }

    @PutMapping("/update/all")
    public ResponseEntity<String> updateAll() {
        apiCaller.getMarketStatistics();
        return ResponseEntity.ok("Successfully Updated");
    }

    @PutMapping("/update/{:typeId}")
    public ResponseEntity<String> updateTypePrice(@PathVariable("typeId") Long typeId) {
        InvestmentType investmentType = service.get(typeId).orElse(null);
        apiCaller.getMarketStatistics(investmentType);
        return ResponseEntity.ok("Successfully Updated");
    }
}
