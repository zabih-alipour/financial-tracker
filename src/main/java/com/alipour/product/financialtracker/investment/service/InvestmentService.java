package com.alipour.product.financialtracker.investment.service;

import com.alipour.product.financialtracker.common.BusinessException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.NotSupportException;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.repository.InvestmentRepository;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@Service
@Transactional
public class InvestmentService extends CRUDService<Investment> {

    private final InvestmentRepository repository;
    private final InvestmentTypeRepository typeRepository;

    public InvestmentService(InvestmentRepository repository, InvestmentTypeRepository typeRepository) {
        this.repository = repository;
        this.typeRepository = typeRepository;
    }

    @Override
    protected JpaRepository<Investment, Long> getRepository() {
        return repository;
    }

    public List<Investment> getByParent(Long parentId) {
        return repository.getByParentId(parentId);
    }

    public Investment add(InvestmentDto dto) {
        Investment investment = dto.getChangeInvestment();

        if (dto.getParent() == null) {
            investment.setDescription("پس انداز ریالی");
            repository.save(investment);
        } else {
            Investment parent = repository.getOne(investment.getParent().getId());
            validate(dto, parent.getInvestmentType());

            InvestmentType investmentType = typeRepository.getOne(investment.getInvestmentType().getId());
            String parentTypeName = parent.getInvestmentType().getName();
            String description = "خرید " +
                    thousandFormat(investment.getAmount()) +
                    " " +
                    investmentType.getName() +
                    " از محل دارایی " +
                    parentTypeName +
                    " به ارزش " +
                    thousandFormat(investment.getAmount() * investment.getExecutedPrice()) +
                    " دلار.";
            investment.setDescription(description);
            repository.saveAndFlush(investment);

            Investment subtractInvestment = dto.getSubtractInvestment();
            description = "تهاتر " +
                    thousandFormat(-subtractInvestment.getAmount()) +
                    " " +
                    parent.getInvestmentType().getName() +
                    " بعد از خرید " +
                    thousandFormat(investment.getAmount()) +
                    " " +
                    investmentType.getName();

            subtractInvestment.setDescription(description);
            repository.save(subtractInvestment);
        }

        return investment;

    }

    private void validate(InvestmentDto dto, InvestmentType parentType) {
        if (!parentType.getCode().equals("RIAL")) {
            Investment changeInvestment = dto.getChangeInvestment();
            Investment subtractInvestment = dto.getSubtractInvestment();

            float exchange = Math.round(changeInvestment.getAmount() * changeInvestment.getExecutedPrice());
            float subtract = Math.round(Math.abs(subtractInvestment.getAmount() * subtractInvestment.getExecutedPrice()));
            if (exchange != subtract) {
                throw new BusinessException(String.format("مقدار کوین دریافتی %f با مقدار کوین مصرفی %f همخوانی ندارد", exchange, subtract));
            }
        }
    }

    @Override
    public Investment add(Investment investment) {
        throw new NotSupportException();
        /*StringBuilder description = new StringBuilder("");
        InvestmentType investmentType = typeRepository.getOne(investment.getInvestmentType().getId());


        if (investmentType.getCode().equals("RIAL")) {
            if (investment.getAmount() > 0) {
                description.append("پس انداز ریالی");
                investment.setDescription(description.toString());
            }
            repository.save(investment);
        } else {
            Investment parent = investment.getParent();
            if (parent != null) {
                parent = repository.getOne(investment.getParent().getId());
                String parentTypeName = parent.getInvestmentType().getName();
                description.append("خرید ")
                        .append(investment.getAmount())
                        .append(" ")
                        .append(investmentType.getName())
                        .append(" از محل دارایی  ")
                        .append(parentTypeName)
                        .append(" به ارزش ")
                        .append(investment.getAmount() * investment.getExecutedPrice())
                        .append(" دلار.");
                investment.setDescription(description.toString());
                investment = repository.saveAndFlush(investment);

                Investment reverse = parent.clone();
                reverse.setAmount(-investment.getSpendAmount());
                description = new StringBuilder("");
                description.append("تهاتر ")
                        .append(investment.getSpendAmount())
                        .append(" ")
                        .append(parent.getInvestmentType().getName())
                        .append(" بعد از خرید  ")
                        .append(investment.getAmount())
                        .append(" ")
                        .append(investmentType.getName())
                        .append(" به ارزش ")
                        .append(investment.getAmount() * investment.getExecutedPrice())
                        .append(" دلار.");
                reverse.setDescription(description.toString());
                repository.save(reverse);

            }
        }
        return investment;*/
    }

    private String thousandFormat(Float number) {
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getInstance(Locale.US);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();

        symbols.setGroupingSeparator(',');
        formatter.setDecimalFormatSymbols(symbols);
        return formatter.format(number);
    }
}