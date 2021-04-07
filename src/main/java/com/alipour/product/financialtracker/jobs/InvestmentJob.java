package com.alipour.product.financialtracker.jobs;

import com.alipour.product.financialtracker.api_caller.NobitexApiCaller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class InvestmentJob {

    private final NobitexApiCaller apiCaller;

    public InvestmentJob(NobitexApiCaller apiCaller) {
        this.apiCaller = apiCaller;
    }


    @Scheduled(fixedRate = (10 * 60 * 1000), initialDelay = (60 * 1000))
    public void investmentTypeUpdate() {
        log.info("InvestmentType started to update latest price .... ");
        apiCaller.getMarketStatistics();
    }
}
