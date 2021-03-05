package com.alipour.product.financialtracker.investment.service;

import com.alipour.product.financialtracker.common.BusinessException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.NotSupportException;
import com.alipour.product.financialtracker.common.ParentDto;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.repository.InvestmentRepository;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.*;

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
            investment.setCode(UUID.randomUUID().getMostSignificantBits() + "");
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
    public void delete(Long id) {
        repository.getByParentId(id).forEach(repository::delete);
        super.delete(id);
    }

    @Override
    public void delete(Investment investment) {
        throw new NotSupportException();
    }

    @Override
    public Investment add(Investment investment) {
        throw new NotSupportException();

    }

    private String thousandFormat(Float number) {
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getInstance(Locale.US);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();

        symbols.setGroupingSeparator(',');
        formatter.setDecimalFormatSymbols(symbols);
        return formatter.format(number);
    }

    public List<Investment> getByUserAndCode(Long userId, Long code) {
        Specification<Investment> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("user").get("id"), userId),
                        criteriaBuilder.like(root.get("code"), code + "%")
                );

        return repository.findAll(specification, Sort.by(Sort.Direction.ASC, "code"));
    }

    public Investment edit(InvestmentDto dto) {
        Investment investment = dto.getChangeInvestment();
        Investment db_obj = repository.getOne(dto.getId());

        if (!repository.getByParentId(db_obj.getId()).isEmpty()) {
            throw new NotSupportException("امکان ویرایش وجود ندارد. ابتدا باید زیر شاخه ها حذف شوند");
        }
        db_obj.setShamsiDate(investment.getShamsiDate());
        db_obj.setAmount(investment.getAmount());
        db_obj.setUser(investment.getUser());
        db_obj.setExecutedPrice(investment.getExecutedPrice());
        if (db_obj.getInvestmentType().getId() != 1L)
            db_obj.setDescription("خرید " +
                    thousandFormat(db_obj.getAmount()) +
                    " " +
                    db_obj.getInvestmentType().getName() +
                    " از محل دارایی " +
                    db_obj.getParent().getInvestmentType().getName() +
                    " به ارزش " +
                    thousandFormat(investment.getAmount() * investment.getExecutedPrice()) +
                    " دلار.");


        return repository.save(db_obj);
    }
}