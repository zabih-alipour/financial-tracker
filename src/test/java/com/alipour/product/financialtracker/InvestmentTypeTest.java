package com.alipour.product.financialtracker;

import com.alipour.product.financialtracker.investment.dto.CoinInfo;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import com.alipour.product.financialtracker.investment_type.dto.InvestmentUserSummary;
import com.alipour.product.financialtracker.investment_type.service.InvestmentTypeService;
import com.alipour.product.financialtracker.user.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {FinancialTrackerApplication.class, H2Config.class})
@Sql(value = "classpath:down.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
@ActiveProfiles("test")
class InvestmentTypeTest {
    @Autowired
    private DataUtil dataUtil;
    @Autowired
    private InvestmentService investmentService;
    @Autowired
    private InvestmentTypeService investmentTypeService;

    @BeforeEach
    public void init() {
        dataUtil.initUsers();
        dataUtil.initInvestmentTypes();
    }

    @Test
    @DisplayName("Get investment summary by user")
    public void investment_type_user_summary() {
        final User user_1 = dataUtil.getUser(true);
        final User user_2 = dataUtil.getUser(false);

        InvestmentDto investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(user_1);
        investment_rial_dto.setShamsiDate("1399/12/01");
        CoinInfo rial = new CoinInfo();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(60_000_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        Investment investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);

        //----- Trade Bitcoin
        InvestmentDto investment_bitcoin_dto = new InvestmentDto();
        investment_bitcoin_dto.setUser(user_1);
        investment_bitcoin_dto.setShamsiDate("1399/12/02");
        investment_bitcoin_dto.setParent(investment_rial);
        CoinInfo bitcoin = new CoinInfo();
        bitcoin.setInvestmentType(dataUtil.getInvestmentType("BITCOIN"));
        bitcoin.setAmount(BigDecimal.valueOf(0.002F));
        bitcoin.setExecutedPrice(BigDecimal.valueOf(9_010F));
        investment_bitcoin_dto.setChange(bitcoin);
        CoinInfo subtract_rial = new CoinInfo();
        subtract_rial.setInvestmentType(investment_rial.getInvestmentType());
        subtract_rial.setAmount(BigDecimal.valueOf(26_245_010F));
        subtract_rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_bitcoin_dto.setSubtract(subtract_rial);
        Investment investment_bitcoin = investmentService.add(investment_bitcoin_dto);
        assertThat(investment_bitcoin.getId()).isGreaterThan(0);

        //----- Trade Litcoin from Bitcoin
        InvestmentDto investment_litcoin_dto = new InvestmentDto();
        investment_litcoin_dto.setUser(user_1);
        investment_litcoin_dto.setShamsiDate("1399/12/03");
        investment_litcoin_dto.setParent(investment_bitcoin);
        CoinInfo litcoin = new CoinInfo();
        litcoin.setInvestmentType(dataUtil.getInvestmentType("LITCOIN"));
        litcoin.setAmount(BigDecimal.valueOf(0.132142857F));
        litcoin.setExecutedPrice(BigDecimal.valueOf(98F));
        investment_litcoin_dto.setChange(litcoin);
        CoinInfo subtract_bitcoin = new CoinInfo();
        subtract_bitcoin.setInvestmentType(investment_bitcoin.getInvestmentType());
        subtract_bitcoin.setAmount(BigDecimal.valueOf(0.001F));
        subtract_bitcoin.setExecutedPrice(BigDecimal.valueOf(12_950F));
        investment_litcoin_dto.setSubtract(subtract_bitcoin);
        Investment investment_litcoin = investmentService.add(investment_litcoin_dto);
        assertThat(investment_litcoin.getId()).isGreaterThan(0);

        ///-------------------- User 2
        investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(user_2);
        investment_rial_dto.setShamsiDate("1400/03/01");
        rial = new CoinInfo();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(8_050_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);

        //----- Trade Bitcoin
        investment_bitcoin_dto = new InvestmentDto();
        investment_bitcoin_dto.setUser(user_2);
        investment_bitcoin_dto.setShamsiDate("1400/03/02");
        investment_bitcoin_dto.setParent(investment_rial);
        bitcoin = new CoinInfo();
        bitcoin.setInvestmentType(dataUtil.getInvestmentType("BITCOIN"));
        bitcoin.setAmount(BigDecimal.valueOf(0.002F));
        bitcoin.setExecutedPrice(BigDecimal.valueOf(5_010F));
        investment_bitcoin_dto.setChange(bitcoin);
        subtract_rial = new CoinInfo();
        subtract_rial.setInvestmentType(investment_rial.getInvestmentType());
        subtract_rial.setAmount(BigDecimal.valueOf(2_245_010F));
        subtract_rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_bitcoin_dto.setSubtract(subtract_rial);
        investment_bitcoin = investmentService.add(investment_bitcoin_dto);
        assertThat(investment_bitcoin.getId()).isGreaterThan(0);

        final List<InvestmentUserSummary> rialSummary = investmentTypeService.summary(dataUtil.getInvestmentType("RIAL").getId());
        assertThat(rialSummary.size()).isEqualTo(2);

        final List<InvestmentUserSummary> liteCoinSummary = investmentTypeService.summary(dataUtil.getInvestmentType("LITCOIN").getId());
        assertThat(liteCoinSummary.size()).isEqualTo(1);
        assertThat(liteCoinSummary.get(0).getUser().getId()).isEqualTo(user_1.getId());

        final List<InvestmentUserSummary> bitcoinSummary = investmentTypeService.summary(dataUtil.getInvestmentType("BITCOIN").getId());
        assertThat(bitcoinSummary.size()).isEqualTo(2);
    }
}
