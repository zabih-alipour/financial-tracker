package com.alipour.product.financialtracker;

import com.alipour.product.financialtracker.api_caller.NobitexApiCaller;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.FileUrlResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class Migration implements CommandLineRunner {
    private final ObjectMapper mapper;
    private final UserService userService;
    private final PaymentService paymentService;
    private final PaymentTypeService paymentTypeService;
    private final InvestmentTypeService investmentTypeService;
    private final NobitexApiCaller nobitexApiCaller;
    private final DataSource dataSource;


    public Migration(ObjectMapper mapper,
                     UserService userService,
                     PaymentService paymentService,
                     PaymentTypeService paymentTypeService,
                     InvestmentTypeService investmentTypeService,
                     InvestmentService investmentService, NobitexApiCaller nobitexApiCaller, DataSource dataSource) {
        this.mapper = mapper;
        this.userService = userService;
        this.paymentService = paymentService;
        this.paymentTypeService = paymentTypeService;
        this.investmentTypeService = investmentTypeService;
        this.nobitexApiCaller = nobitexApiCaller;
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        importUsers();
        importPaymentTypes();
        importPayment();
        importInvestmentTypes();
        importInvestments();
        updateDb();

    }

    private void updateDb() throws IOException {
        final Set<FileUrlResource> files = Files.list(Paths.get(ResourceUtils.getFile("classpath:migration/sqls/").toURI()))
                .filter(p -> !p.getFileName().endsWith("_executed"))
                .sorted(Comparator.comparing(Path::getFileName))
                .map(p -> {
                    try {
                        return new FileUrlResource(p.toFile().getPath());
                    } catch (MalformedURLException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .collect(Collectors.toSet());

        ResourceDatabasePopulator databasePopulator =
                new ResourceDatabasePopulator(false, false, "UTF-8", files.toArray(new FileUrlResource[files.size()]));
        databasePopulator.execute(dataSource);

        for (FileUrlResource resource : files) {
            File file = resource.getFile();

            final String filePath = file.getPath().concat(file.getName().substring(0, file.getName().indexOf(".")).concat("___executed.sql"));
            log.info(filePath);
//            file.renameTo(new File(filePath));
        }
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
                    investmentType.setLatestPrice(BigDecimal.valueOf(node.get("latest_price").asDouble()));
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
