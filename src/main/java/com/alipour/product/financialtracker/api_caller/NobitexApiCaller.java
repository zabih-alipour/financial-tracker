package com.alipour.product.financialtracker.api_caller;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.squareup.okhttp.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.UnknownHostException;
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

    public NobitexApiCaller(InvestmentTypeService investmentTypeService, ObjectMapper mapper, OkHttpClient client) {
        this.investmentTypeService = investmentTypeService;
        this.mapper = mapper;
        this.client = client;
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
                        global.get("binance").fields().forEachRemaining(entry -> {
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
                        });
                    }
                }
            }
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
