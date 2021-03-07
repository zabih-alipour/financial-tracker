package com.alipour.product.financialtracker.investment.service;

import com.alipour.product.financialtracker.common.BusinessException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.NotSupportException;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.repository.InvestmentRepository;
import com.alipour.product.financialtracker.investment.repository.VwInvestmentRepository;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.MathContext;
import java.security.SecureRandom;
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
    private final SecureRandom random;
    private final VwInvestmentRepository vwInvestmentRepository;


    public InvestmentService(InvestmentRepository repository, InvestmentTypeRepository typeRepository, SecureRandom random, VwInvestmentRepository vwInvestmentRepository) {
        this.repository = repository;
        this.typeRepository = typeRepository;
        this.random = random;
        this.vwInvestmentRepository = vwInvestmentRepository;
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
        } else {
            InvestmentType investmentType = typeRepository.getOne(investment.getInvestmentType().getId());
            Investment parent = repository.getOne(investment.getParent().getId());
            validate(dto, parent.getInvestmentType());


            Investment subtractInvestment = dto.getSubtractInvestment();
            String description = "تهاتر " +
                    thousandFormat(subtractInvestment.getAmount()) +
                    " " +
                    parent.getInvestmentType().getName() +
                    " بعد از خرید " +
                    thousandFormat(investment.getAmount()) +
                    " " +
                    investmentType.getName();

            BigDecimal amount = subtractInvestment.getAmount().multiply(BigDecimal.valueOf(-1));
            subtractInvestment.setDescription(description);
            subtractInvestment.setAmount(amount);
            subtractInvestment.setCode(generateCode());
            repository.save(subtractInvestment);


            String parentTypeName = parent.getInvestmentType().getName();
            description = "خرید " +
                    thousandFormat(investment.getAmount()) +
                    " " +
                    investmentType.getName() +
                    " از محل دارایی " +
                    parentTypeName +
                    " به ارزش " +
                    thousandFormat(investment.getAmount().multiply(investment.getExecutedPrice())) +
                    " دلار.";
            investment.setDescription(description);
            investment.setParent(subtractInvestment);


        }
        investment.setCode(generateCode());
        repository.save(investment);

        return investment;

    }

    private void validate(InvestmentDto dto, InvestmentType parentType) {
        if (!parentType.getCode().equals("RIAL")) {
            Investment changeInvestment = dto.getChangeInvestment();
            Investment subtractInvestment = dto.getSubtractInvestment();

            BigDecimal exchange = changeInvestment.getAmount().multiply(changeInvestment.getExecutedPrice()).round(MathContext.DECIMAL64);
            BigDecimal subtract = subtractInvestment.getAmount().multiply(subtractInvestment.getExecutedPrice()).abs();
            if (exchange.equals(subtract)) {
                throw new BusinessException(String.format("مقدار کوین دریافتی %f با مقدار کوین مصرفی %f همخوانی ندارد", exchange, subtract));
            }
        }
    }

    private String generateCode() {
        return String.format("%d", random.nextInt(999999));
    }

    @Override
    public void delete(Long id) {
        Investment investment = repository.getOne(id);
        Investment parent = investment.getParent();
        repository.getByParentId(id).forEach(repository::delete);
        repository.delete(investment);
        if (parent != null)
            repository.delete(parent);
    }

    @Override
    public void delete(Investment investment) {
        throw new NotSupportException();
    }

    @Override
    public Investment add(Investment investment) {
        throw new NotSupportException();

    }

    private String thousandFormat(BigDecimal number) {
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getInstance(Locale.US);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();

        symbols.setGroupingSeparator(',');
        formatter.setDecimalFormatSymbols(symbols);
        return formatter.format(number);
    }

    public List<Investment> findAll(Long userId, String parentCode) {
        Specification<Investment> specification = (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.isNotNull(root.get("user"));
            if (parentCode != null && !parentCode.isEmpty())
                predicate = criteriaBuilder.like(root.get("parent").get("code"), parentCode + "%");

            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("user").get("id"), userId),
                    predicate
            );
        };
        return repository.findAll(specification, Sort.by(Sort.Direction.ASC, "shamsiDate"));
    }

    public List<VwInvestment> search() {
        return vwInvestmentRepository.findAll(Sort.by(Sort.Direction.DESC, "shamsiDate"));
    }

    public List<VwInvestment> getByUserAndCode(Long userId, String code) {
        Specification<VwInvestment> specification = (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.isNotNull(root.get("user"));
            if (code != null && !code.isEmpty())
                predicate = criteriaBuilder.like(root.get("code"), code + "%");

            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("user").get("id"), userId),
                    criteriaBuilder.greaterThan(root.get("amount"), 0),
                    predicate
            );
        };

        return vwInvestmentRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "code"));
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
                    thousandFormat(investment.getAmount().multiply(investment.getExecutedPrice())) +
                    " دلار.");


        return repository.save(db_obj);
    }

    public List<VwInvestment> getByUser(Long userId) {
        return getByUserAndCode(userId, null);
    }
}