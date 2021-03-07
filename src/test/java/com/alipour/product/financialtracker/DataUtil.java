package com.alipour.product.financialtracker;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.services.UserService;
import org.assertj.core.api.Assertions;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@SpringBootTest(classes = H2Config.class)
@Profile("test")
@Component
class DataUtil {

    private final UserService userService;
    private final InvestmentTypeService investmentTypeService;

    DataUtil(UserService userService, InvestmentTypeService investmentTypeService) {
        this.userService = userService;
        this.investmentTypeService = investmentTypeService;
    }

    public void initUsers() {
        User user_1 = new User();
        user_1.setName("user_1");
        userService.add(user_1);
        Assertions.assertThat(user_1.getId()).isGreaterThan(0);

        User user_2 = new User();
        user_2.setName("user_2");
        userService.add(user_2);
        Assertions.assertThat(user_2.getId()).isGreaterThan(0);
    }

    public void initInvestmentTypes() {
        InvestmentType type_rial = new InvestmentType();
        type_rial.setName("ریال");
        type_rial.setCode("RIAL");
        investmentTypeService.add(type_rial);
        Assertions.assertThat(type_rial.getId()).isGreaterThan(0);

        InvestmentType type_bitcoin = new InvestmentType();
        type_bitcoin.setName("بیت کوین");
        type_bitcoin.setCode("BITCOIN");
        investmentTypeService.add(type_bitcoin);
        Assertions.assertThat(type_bitcoin.getId()).isGreaterThan(0);

        InvestmentType type_litcoin = new InvestmentType();
        type_litcoin.setName("لایت کوین");
        type_litcoin.setCode("LITCOIN");
        investmentTypeService.add(type_litcoin);
        Assertions.assertThat(type_litcoin.getId()).isGreaterThan(0);
    }

    public User getUser(boolean first) {
        List<User> all = userService.findAll();
        return first ? all.get(1) : all.get(2);
    }

    public InvestmentType getInvestmentType(String code) {
        List<InvestmentType> all = investmentTypeService.findAll();
        return all.stream().filter(p -> p.getCode().equals(code)).findFirst().orElse(null);
    }

    public String thousandFormat(BigDecimal number) {
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getInstance(Locale.US);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();

        symbols.setGroupingSeparator(',');
        formatter.setDecimalFormatSymbols(symbols);
        return formatter.format(number);
    }
}
