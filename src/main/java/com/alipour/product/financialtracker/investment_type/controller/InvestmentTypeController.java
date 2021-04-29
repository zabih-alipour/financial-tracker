package com.alipour.product.financialtracker.investment_type.controller;

import com.alipour.product.financialtracker.api_caller.NobitexApiCaller;
import com.alipour.product.financialtracker.common.CRUDController;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.service.PaymentService;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@RestController
@RequestMapping("/api/investment_types")
public class InvestmentTypeController extends CRUDController<InvestmentType> {
    private final NobitexApiCaller apiCaller;

    public InvestmentTypeController(InvestmentTypeService service, NobitexApiCaller apiCaller) {
        super(service);
        this.apiCaller = apiCaller;
    }

    @PutMapping("/update/all")
    public ResponseEntity<String> updateAll() {
        apiCaller.getMarketStatistics2();
        return ResponseEntity.ok("Successfully Updated");
    }

    @PutMapping("/update/{:typeId}")
    public ResponseEntity<String> updateTypePrice(@PathVariable("typeId") Long typeId) {
        InvestmentType investmentType = service.get(typeId).orElse(null);
        apiCaller.getMarketStatistics(investmentType);
        return ResponseEntity.ok("Successfully Updated");
    }

    @PostMapping("/search")
    @ResponseBody
    public Page<InvestmentType> search(@RequestBody(required = false) SearchCriteria searchCriteria) {
        return ((InvestmentTypeService) service).search(searchCriteria);
    }
}
