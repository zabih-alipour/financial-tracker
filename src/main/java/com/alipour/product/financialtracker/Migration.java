package com.alipour.product.financialtracker;

import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.service.PaymentService;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.payment_type.service.PaymentTypeService;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.services.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;

@Component
public class Migration implements CommandLineRunner {
    private final ObjectMapper mapper;
    private UserService userService;
    private PaymentService paymentService;
    private PaymentTypeService paymentTypeService;
    private InvestmentTypeService investmentTypeService;
    private InvestmentService investmentService;


    public Migration(ObjectMapper mapper,
                     UserService userService,
                     PaymentService paymentService,
                     PaymentTypeService paymentTypeService,
                     InvestmentTypeService investmentTypeService,
                     InvestmentService investmentService) {
        this.mapper = mapper;
        this.userService = userService;
        this.paymentService = paymentService;
        this.paymentTypeService = paymentTypeService;
        this.investmentTypeService = investmentTypeService;
        this.investmentService = investmentService;
    }

    @Override
    public void run(String... args) throws Exception {
        importUsers();
        importPaymentTypes();
        importPayment();
        importInvestmentTypes();
        importInvestments();
    }

    private void importInvestments() throws Exception {
        //Done manually
    }

    private void importInvestmentTypes() throws Exception {
        if (investmentTypeService.count() == 0) {
            try (FileReader reader = new FileReader(ResourceUtils.getFile("classpath:migration/investment_type.json"))) {
                JsonNode tree = mapper.readTree(reader);
                tree.forEach(node -> {
                    InvestmentType investmentType = new InvestmentType();
                    investmentType.setName(node.get("name").asText());
                    investmentType.setLatestPrice(node.get("latest_price").asDouble());
                    investmentType.setCode(node.get("name").asText());
                    investmentTypeService.add(investmentType);
                });
            }
        }
    }

    private void importPayment() throws IOException {
        if (paymentService.count() == 0) {
            try (FileReader reader = new FileReader(ResourceUtils.getFile("classpath:migration/cardex.json"))) {
                JsonNode tree = mapper.readTree(reader);
                tree.forEach(node -> {
                    Payment payment = new Payment();
                    payment.setUser(new User(node.get("user_id").asLong()));
                    payment.setPaymentType(new PaymentType(node.get("transaction_id").asLong() + 1));
                    payment.setAmount(BigDecimal.valueOf(node.get("amount").asLong()));
                    payment.setShamsiDate(node.get("shamsi_date").asText());
                    payment.setDescription(payment.getAmount().longValue() > 0 ? node.get("description").asText() : "تسویه " + node.get("description").asText());
                    paymentService.add(payment);
                });
            }
        }
    }

    private void importPaymentTypes() throws IOException {
        if (paymentTypeService.count() == 0) {
            PaymentType root = new PaymentType();
            root.setName("بدهی");
            root = paymentTypeService.add(root);

            try (FileReader reader = new FileReader(ResourceUtils.getFile("classpath:migration/transaction_child.json"))) {
                JsonNode tree = mapper.readTree(reader);
                PaymentType finalRoot = root;
                tree.forEach(node -> {
                    PaymentType paymentType = new PaymentType();
                    paymentType.setName(node.get("name").asText());
                    if (node.get("transaction_type_id").asLong() == finalRoot.getId()) {
                        paymentType.setParent(new PaymentType(finalRoot.getId()));
                    }
                    paymentTypeService.add(paymentType);
                });
            }
        }
    }

    private void importUsers() throws IOException {
        if (userService.count() == 0) {
            try (FileReader reader = new FileReader(ResourceUtils.getFile("classpath:migration/user.json"))) {
                JsonNode tree = mapper.readTree(reader);
                tree.forEach(node -> {
                    User user = new User();
                    user.setName(node.get("name").asText());
                    userService.add(user);
                });
            }
        }
    }
}
