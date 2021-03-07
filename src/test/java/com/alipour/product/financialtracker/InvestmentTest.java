package com.alipour.product.financialtracker;

import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {FinancialTrackerApplication.class, H2Config.class})
@ActiveProfiles("test")
class InvestmentTest {
    @Autowired
    private DataUtil dataUtil;
    @Autowired
    private InvestmentService investmentService;

    @BeforeEach
    public void init() {
        dataUtil.initUsers();
        dataUtil.initInvestmentTypes();
    }

    @Test
    public void add_rial_investment() {
        long size_before = investmentService.count();
        InvestmentDto investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(dataUtil.getUser(true));
        investment_rial_dto.setShamsiDate("1399/12/01");
        InvestmentDto.Coin rial = new InvestmentDto.Coin();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(500_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        Investment investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);
        assertThat(investment_rial.getDescription()).isEqualTo("پس انداز ریالی");
        assertThat(investmentService.count()).isEqualTo(size_before + 1);
    }

    @Test
    public void add_2_step_investment() {
        long size_before = investmentService.count();

        InvestmentDto investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(dataUtil.getUser(true));
        investment_rial_dto.setShamsiDate("1399/12/01");
        InvestmentDto.Coin rial = new InvestmentDto.Coin();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(50_000_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        Investment investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);
        assertThat(investment_rial.getDescription()).isEqualTo("پس انداز ریالی");
        assertThat(investmentService.count()).isEqualTo(size_before + 1);
        size_before = investmentService.count();

        InvestmentDto investment_bitcoin_dto = new InvestmentDto();
        investment_bitcoin_dto.setUser(dataUtil.getUser(true));
        investment_bitcoin_dto.setShamsiDate("1399/12/02");
        investment_bitcoin_dto.setParent(investment_rial);
        InvestmentDto.Coin bitcoin = new InvestmentDto.Coin();
        bitcoin.setInvestmentType(dataUtil.getInvestmentType("BITCOIN"));
        bitcoin.setAmount(BigDecimal.valueOf(0.002F));
        bitcoin.setExecutedPrice(BigDecimal.valueOf(9_010F));
        investment_bitcoin_dto.setChange(bitcoin);
        InvestmentDto.Coin subtract = new InvestmentDto.Coin();
        subtract.setInvestmentType(investment_rial.getInvestmentType());
        subtract.setAmount(BigDecimal.valueOf(26_245_010F));
        subtract.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_bitcoin_dto.setSubtract(subtract);
        Investment investment_bitcoin = investmentService.add(investment_bitcoin_dto);
        assertThat(investment_bitcoin.getId()).isGreaterThan(0);
        assertThat(investmentService.count()).isEqualTo(size_before + 2);

        List<Investment> children = investmentService.getByParent(investment_rial.getId());
        children.forEach(p -> {
            assertThat(Arrays.asList("خرید 0.002 بیت کوین از محل دارایی ریال به ارزش " +
                            dataUtil.thousandFormat(p.getAmount().multiply(p.getExecutedPrice())) +
                            " دلار.",
                    "تهاتر " +
                            dataUtil.thousandFormat(BigDecimal.valueOf(26245010F)) +
                            " " +
                            subtract.getInvestmentType().getName() +
                            " بعد از خرید " +
                            dataUtil.thousandFormat(bitcoin.getAmount()) +
                            " " +
                            bitcoin.getInvestmentType().getName()))
                    .containsSubsequence(p.getDescription());
        });
    }

    @Test
    public void add_3_step_investment() {
        long size_before = investmentService.count();

        InvestmentDto investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(dataUtil.getUser(true));
        investment_rial_dto.setShamsiDate("1399/12/01");
        InvestmentDto.Coin rial = new InvestmentDto.Coin();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(60_000_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        Investment investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);
        assertThat(investment_rial.getDescription()).isEqualTo("پس انداز ریالی");
        assertThat(investmentService.count()).isEqualTo(size_before + 1);
        size_before = investmentService.count();

        //----- Trade Bitcoin
        InvestmentDto investment_bitcoin_dto = new InvestmentDto();
        investment_bitcoin_dto.setUser(dataUtil.getUser(true));
        investment_bitcoin_dto.setShamsiDate("1399/12/02");
        investment_bitcoin_dto.setParent(investment_rial);
        InvestmentDto.Coin bitcoin = new InvestmentDto.Coin();
        bitcoin.setInvestmentType(dataUtil.getInvestmentType("BITCOIN"));
        bitcoin.setAmount(BigDecimal.valueOf(0.002F));
        bitcoin.setExecutedPrice(BigDecimal.valueOf(9_010F));
        investment_bitcoin_dto.setChange(bitcoin);
        InvestmentDto.Coin subtract_rial = new InvestmentDto.Coin();
        subtract_rial.setInvestmentType(investment_rial.getInvestmentType());
        subtract_rial.setAmount(BigDecimal.valueOf(26_245_010F));
        subtract_rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_bitcoin_dto.setSubtract(subtract_rial);
        Investment investment_bitcoin = investmentService.add(investment_bitcoin_dto);
        assertThat(investment_bitcoin.getId()).isGreaterThan(0);
        assertThat(investmentService.count()).isEqualTo(size_before + 2);

        List<Investment> children = investmentService.getByParent(investment_rial.getId());
        children.forEach(p ->
                assertThat(Arrays.asList("خرید " +
                                dataUtil.thousandFormat(bitcoin.getAmount()) +
                                " بیت کوین از محل دارایی ریال به ارزش " +
                                dataUtil.thousandFormat(p.getAmount() .multiply( p.getExecutedPrice())) +
                                " دلار.",
                        "تهاتر " +
                                dataUtil.thousandFormat(subtract_rial.getAmount().negate()) +
                                " " +
                                subtract_rial.getInvestmentType().getName() +
                                " بعد از خرید " +
                                dataUtil.thousandFormat(bitcoin.getAmount()) +
                                " " +
                                bitcoin.getInvestmentType().getName()))
                        .containsSubsequence(p.getDescription()));

        //----- Trade Litcoin from Bitcoin
        size_before = investmentService.count();
        InvestmentDto investment_litcoin_dto = new InvestmentDto();
        investment_litcoin_dto.setUser(dataUtil.getUser(true));
        investment_litcoin_dto.setShamsiDate("1399/12/03");
        investment_litcoin_dto.setParent(investment_bitcoin);
        InvestmentDto.Coin litcoin = new InvestmentDto.Coin();
        litcoin.setInvestmentType(dataUtil.getInvestmentType("LITCOIN"));
        litcoin.setAmount(BigDecimal.valueOf(0.132142857F));
        litcoin.setExecutedPrice(BigDecimal.valueOf(98F));
        investment_litcoin_dto.setChange(litcoin);
        InvestmentDto.Coin subtract_bitcoin = new InvestmentDto.Coin();
        subtract_bitcoin.setInvestmentType(investment_bitcoin.getInvestmentType());
        subtract_bitcoin.setAmount(BigDecimal.valueOf(0.001F));
        subtract_bitcoin.setExecutedPrice(BigDecimal.valueOf(12_950F));
        investment_litcoin_dto.setSubtract(subtract_bitcoin);
        Investment investment_litcoin = investmentService.add(investment_litcoin_dto);
        assertThat(investment_litcoin.getId()).isGreaterThan(0);
        assertThat(investmentService.count()).isEqualTo(size_before + 2);

        children = investmentService.getByParent(investment_bitcoin.getId());
        children.forEach(p ->
                assertThat(Arrays.asList(
                        "خرید " +
                                dataUtil.thousandFormat(litcoin.getAmount()) +
                                " لایت کوین از محل دارایی بیت کوین به ارزش " +
                                dataUtil.thousandFormat(p.getAmount().multiply( p.getExecutedPrice())) +
                                " دلار.",
                        "تهاتر " +
                                dataUtil.thousandFormat(subtract_bitcoin.getAmount().negate()) +
                                " " +
                                subtract_bitcoin.getInvestmentType().getName() +
                                " بعد از خرید " +
                                dataUtil.thousandFormat(litcoin.getAmount()) +
                                " " +
                                litcoin.getInvestmentType().getName()))
                        .containsSubsequence(p.getDescription()));
    }

    @Test
    public void delete_2_step_investment() {
        long size_before = investmentService.count();

        InvestmentDto investment_rial_dto = new InvestmentDto();
        investment_rial_dto.setUser(dataUtil.getUser(true));
        investment_rial_dto.setShamsiDate("1399/11/01");
        InvestmentDto.Coin rial = new InvestmentDto.Coin();
        rial.setInvestmentType(dataUtil.getInvestmentType("RIAL"));
        rial.setAmount(BigDecimal.valueOf(800_000F));
        rial.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_rial_dto.setChange(rial);
        Investment investment_rial = investmentService.add(investment_rial_dto);
        assertThat(investment_rial.getId()).isGreaterThan(0);
        assertThat(investment_rial.getDescription()).isEqualTo("پس انداز ریالی");
        assertThat(investmentService.count()).isEqualTo(size_before + 1);
        size_before = investmentService.count();

        InvestmentDto investment_bitcoin_dto = new InvestmentDto();
        investment_bitcoin_dto.setUser(dataUtil.getUser(true));
        investment_bitcoin_dto.setShamsiDate("1399/11/02");
        investment_bitcoin_dto.setParent(investment_rial);
        InvestmentDto.Coin bitcoin = new InvestmentDto.Coin();
        bitcoin.setInvestmentType(dataUtil.getInvestmentType("BITCOIN"));
        bitcoin.setAmount(BigDecimal.valueOf(0.002F));
        bitcoin.setExecutedPrice(BigDecimal.valueOf(9_010F));
        investment_bitcoin_dto.setChange(bitcoin);
        InvestmentDto.Coin subtract = new InvestmentDto.Coin();
        subtract.setInvestmentType(investment_rial.getInvestmentType());
        subtract.setAmount(BigDecimal.valueOf(26_245_010F));
        subtract.setExecutedPrice(BigDecimal.valueOf(1F));
        investment_bitcoin_dto.setSubtract(subtract);
        Investment investment_bitcoin = investmentService.add(investment_bitcoin_dto);
        assertThat(investment_bitcoin.getId()).isGreaterThan(0);
        assertThat(investmentService.count()).isEqualTo(size_before + 2);

        size_before = investmentService.count();
        investmentService.delete(investment_rial.getId());
        assertThat(investmentService.count()).isEqualTo(size_before - 3);
    }
}
