package com.alipour.product.financialtracker.api_caller;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.alipour.product.financialtracker.type_price_history.service.InvestmentTypePriceHistoryService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.squareup.okhttp.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class NobitexApiCaller {
    private final String MARKET_STATS = "https://api.nobitex.ir/market/stats";
    private final InvestmentTypeService investmentTypeService;
    private final ObjectMapper mapper;
    private final OkHttpClient client;
    private final InvestmentTypePriceHistoryService typePriceHistoryService;
    private final InvestmentTypeRepository investmentTypeRepository;

    public NobitexApiCaller(InvestmentTypeService investmentTypeService, ObjectMapper mapper, OkHttpClient client, InvestmentTypePriceHistoryService typePriceHistoryService, InvestmentTypeRepository investmentTypeRepository) {
        this.investmentTypeService = investmentTypeService;
        this.mapper = mapper;
        this.client = client;
        this.typePriceHistoryService = typePriceHistoryService;
        this.investmentTypeRepository = investmentTypeRepository;
    }

    @Transactional
    public void getMarketStatistics2() {
        final ObjectNode node = mapper.createObjectNode();
        node.set("srcCurrency", new TextNode("USDT"));
        node.set("dstCurrency", new TextNode("IRT"));

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, node.toString());
        Request request = new Request.Builder()
                .url(MARKET_STATS)
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .build();
        try {
            Response response = client.newCall(request).execute();
            if (response.code() == HttpStatus.OK.value()) {
                JsonNode bodyJsonNode = mapper.readTree(response.body().string());
                if (bodyJsonNode != null) {
                    JsonNode stats = bodyJsonNode.get("stats");
                    if (stats.hasNonNull("USDT-IRT")) {
                        JsonNode usdtIRT = stats.get("USDT-IRT");
                        investmentTypeRepository.updatePrice("USDT", BigDecimal.valueOf(usdtIRT.get("bestBuy").asDouble()));
                    }

                    JsonNode global = bodyJsonNode.get("global");
                    if (global.hasNonNull("binance")) {
                        for (Iterator<Map.Entry<String, JsonNode>> it = global.get("binance").fields(); it.hasNext(); ) {
                            Map.Entry<String, JsonNode> entry = it.next();

                            if (!entry.getKey().equalsIgnoreCase("USDT")) {
                                int updated = investmentTypeRepository.updatePrice(entry.getKey().toUpperCase(),
                                        BigDecimal.valueOf(entry.getValue().asDouble()));
                                if (updated != 1) {
                                    InvestmentType type = new InvestmentType();
                                    type.setName(entry.getKey().toUpperCase());
                                    type.setCode(entry.getKey().toUpperCase());
                                    type.setLatestPrice(BigDecimal.valueOf(entry.getValue().asDouble()));
                                    investmentTypeService.add(type);
                                }
                            }
                        }
                    }
                }
            }
            typePriceHistoryService.getCopy();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void getMarketStatistics() {

        List<InvestmentType> investmentTypes = investmentTypeService.findAll();
        Map<String, InvestmentType> typeMap = investmentTypes.stream().collect(Collectors.toMap(InvestmentType::getCode, p -> p));

        final ObjectNode node = mapper.createObjectNode();
        node.set("srcCurrency", new TextNode("USDT"));
        node.set("dstCurrency", new TextNode("IRT"));

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, node.toString());
        Request request = new Request.Builder()
                .url(MARKET_STATS)
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .build();
        try {
            Response response = client.newCall(request).execute();
            if (response.code() == HttpStatus.OK.value()) {
                JsonNode bodyJsonNode = mapper.readTree(response.body().string());
                if (bodyJsonNode != null) {
                    JsonNode stats = bodyJsonNode.get("stats");
                    if (stats.hasNonNull("USDT-IRT")) {
                        JsonNode usdtIRT = stats.get("USDT-IRT");
                        InvestmentType type = typeMap.get("USDT");
                        type.setLatestPrice(BigDecimal.valueOf(usdtIRT.get("bestBuy").asDouble()));
                        investmentTypeService.edit(type);
                    }

                    JsonNode global = bodyJsonNode.get("global");
                    if (global.hasNonNull("binance")) {
                        for (Iterator<Map.Entry<String, JsonNode>> it = global.get("binance").fields(); it.hasNext(); ) {
                            Map.Entry<String, JsonNode> entry = it.next();
                            InvestmentType type = typeMap.get(entry.getKey().toUpperCase());
                            if (type != null) {
                                if (!type.getCode().equals("USDT")) {
                                    type.setLatestPrice(BigDecimal.valueOf(entry.getValue().asDouble()));
                                    investmentTypeService.edit(type);
                                }
                            } else {
                                type = new InvestmentType();
                                type.setName(entry.getKey().toUpperCase());
                                type.setCode(entry.getKey().toUpperCase());
                                type.setLatestPrice(BigDecimal.valueOf(entry.getValue().asDouble()));
                                investmentTypeService.add(type);
                            }
                        }
                    }
                }
            }
            typePriceHistoryService.getCopy();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void getMarketStatistics(InvestmentType investmentType) {
        if (investmentType != null) {
            final ObjectNode node = mapper.createObjectNode();
            node.set("srcCurrency", new TextNode(investmentType.getCode()));
            node.set("dstCurrency", new TextNode("USDT"));

            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(mediaType, node.toString());
            Request request = new Request.Builder()
                    .url(MARKET_STATS)
                    .method("POST", body)
                    .addHeader("Content-Type", "application/json")
                    .build();
            try {
                Response response = client.newCall(request).execute();
                if (response.code() == HttpStatus.OK.value()) {
                    JsonNode bodyJsonNode = mapper.readTree(response.body().string());
                    if (bodyJsonNode != null) {
                        JsonNode stats = bodyJsonNode.get("stats");
                        final String fieldName = investmentType.getCode() + "_USDT";
                        if (stats.hasNonNull(fieldName)) {
                            JsonNode usdtIRT = stats.get(fieldName);
                            investmentType.setLatestPrice(BigDecimal.valueOf(usdtIRT.get("bestBuy").asDouble()));
                            investmentTypeService.edit(investmentType);
                        }
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
