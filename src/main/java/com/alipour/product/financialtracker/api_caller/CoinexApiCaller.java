package com.alipour.product.financialtracker.api_caller;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

@Component
@Slf4j
public class CoinexApiCaller {
    private final String MARKET_STATICS = "https://api.coinex.com/v1/market/ticker";

    private final RestTemplate restTemplate;
    private final InvestmentTypeService investmentTypeService;

    public CoinexApiCaller(RestTemplate restTemplate, InvestmentTypeService investmentTypeService) {
        this.restTemplate = restTemplate;
        this.investmentTypeService = investmentTypeService;
    }

    public void getMarketStatistics() {
        List<InvestmentType> investmentTypes = investmentTypeService.findAll();
        ResponseEntity<JsonNode> entity = restTemplate.getForEntity(MARKET_STATICS.concat("/all"), JsonNode.class);
        if (entity.getStatusCode() == HttpStatus.OK) {
            if (entity.getBody() != null) {
                JsonNode data = entity.getBody().get("data");
                if (!data.isNull()) {
                    JsonNode ticker = data.get("ticker");
                    investmentTypes.forEach(investmentType -> {
                        JsonNode jsonNode = ticker.get(investmentType.getCode().concat("USDT"));
                        if (jsonNode != null) {
                            investmentType.setLatestPrice(BigDecimal.valueOf(jsonNode.get("last").asDouble()));
                            investmentTypeService.add(investmentType);
                        }
                    });
                }
            }
        }
    }

    public void getMarketStatistics(InvestmentType investmentType) {
        if (investmentType != null) {
            ResponseEntity<JsonNode> entity = restTemplate.getForEntity(
                    MARKET_STATICS.concat("?market=").concat(investmentType.getCode().concat("USDT")), JsonNode.class);
            if (entity.getStatusCode() == HttpStatus.OK) {
                if (entity.getBody() != null) {
                    JsonNode data = entity.getBody().get("data");
                    if (!data.isNull()) {
                        JsonNode ticker = data.get("ticker");
                        investmentType.setLatestPrice(BigDecimal.valueOf(ticker.get("last").asDouble()));
                        investmentTypeService.add(investmentType);

                    }
                }
            }
        }
    }
}
