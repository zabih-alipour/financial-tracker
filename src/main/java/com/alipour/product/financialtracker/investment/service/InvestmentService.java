package com.alipour.product.financialtracker.investment.service;

import com.alipour.product.financialtracker.common.BusinessException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.DateUtils;
import com.alipour.product.financialtracker.common.NotSupportException;
import com.alipour.product.financialtracker.investment.dto.AssetSummaryDto;
import com.alipour.product.financialtracker.investment.dto.CoinInfo;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.dto.InvestmentReport;
import com.alipour.product.financialtracker.investment.models.Investment;
import com.alipour.product.financialtracker.investment.models.InvestmentSummary;
import com.alipour.product.financialtracker.investment.repository.AssetSummaryRepository;
import com.alipour.product.financialtracker.investment.repository.InvestmentRepository;
import com.alipour.product.financialtracker.investment.repository.VwInvestmentRepository;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import com.alipour.product.financialtracker.utils.SpecificationBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
import java.util.function.BiFunction;
import java.util.stream.Collectors;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-19 14:22:11
 */
@Service
@Transactional
@Slf4j
public class InvestmentService extends CRUDService<Investment> {

    private final InvestmentRepository repository;
    private final InvestmentTypeRepository typeRepository;
    private final SecureRandom random;
    private final VwInvestmentRepository vwInvestmentRepository;
    private final AssetSummaryRepository assetSummaryRepository;


    public InvestmentService(
            InvestmentRepository repository,
            InvestmentTypeRepository typeRepository,
            SecureRandom random,
            VwInvestmentRepository vwInvestmentRepository, AssetSummaryRepository assetSummaryRepository) {
        this.repository = repository;
        this.typeRepository = typeRepository;
        this.random = random;
        this.vwInvestmentRepository = vwInvestmentRepository;
        this.assetSummaryRepository = assetSummaryRepository;
    }

    @Override
    protected JpaRepository<Investment, Long> getRepository() {
        return repository;
    }

    public List<Investment> getByParent(Long parentId) {
        return repository.getByParentId(parentId);
    }

    public Investment add(InvestmentDto dto) {
        if (dto.getShamsiDate() == null) {
            dto.setShamsiDate(DateUtils.getTodayJalali());
        }

        Investment investment = dto.getChangeInvestment();
        if (dto.getParent() == null) {
            investment.setDescription("پس انداز ریالی");
        } else {
            InvestmentType investmentType = typeRepository.getOne(investment.getInvestmentType().getId());
            Investment parent = repository.getOne(investment.getParent().getId());
            validate(dto, parent.getInvestmentType());

            Investment subtractInvestment = dto.getSubtractInvestment();
            String description = getParentDescription(investment, investmentType, parent, subtractInvestment);

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
                    " ".concat(parent.getInvestmentType().getId() == 1 ? "تومان." : "دلار.");
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

    public Page<VwInvestment> searchVwInvestments(SearchCriteria searchCriteria) {
        searchCriteria = Optional.ofNullable(searchCriteria).orElse(new SearchCriteria());
        SpecificationBuilder<VwInvestment> specificationBuilder = new SpecificationBuilder<>(searchCriteria, VwInvestment.class);
        return vwInvestmentRepository.findAll(specificationBuilder.specification(), specificationBuilder.pageRequest());
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
        InvestmentType investmentType = typeRepository.getOne(investment.getInvestmentType().getId());

        db_obj.setShamsiDate(investment.getShamsiDate());
        db_obj.setAmount(investment.getAmount());
        db_obj.setExecutedPrice(investment.getExecutedPrice());
        db_obj.setUser(investment.getUser());

        if (dto.getParent() == null) {
            db_obj.setDescription("پس انداز ریالی");
        } else
            db_obj.setDescription("خرید " +
                    thousandFormat(db_obj.getAmount()) +
                    " " +
                    db_obj.getInvestmentType().getName() +
                    " از محل دارایی " +
                    db_obj.getParent().getInvestmentType().getName() +
                    " به ارزش " +
                    thousandFormat(investment.getAmount().multiply(investment.getExecutedPrice())) +
                    " ".concat(investmentType.getId() == 1 ? "تومان." : "دلار."));

        if (dto.getParent() != null && db_obj.getParent() == null) {
            addParent(dto, investment, investmentType);
        } else if (dto.getParent() == null && db_obj.getParent() != null) {
            repository.delete(db_obj.getParent());
        } else if (dto.getParent() != null && db_obj.getParent() != null) {
            if (!dto.getParent().getId().equals(db_obj.getParent().getId())) {
                throw new NotSupportException("امکان ویرایش والد وجود ندارد.");
            }
            Investment parent = dto.getSubtractInvestment();
            db_obj.setAmount(parent.getAmount());
            db_obj.setExecutedPrice(parent.getExecutedPrice());
            db_obj.setDescription(getParentDescription(investment, investmentType, parent, parent));
        }
        return repository.save(db_obj);
    }

    private void addParent(InvestmentDto dto, Investment investment, InvestmentType investmentType) {
        Investment parent = repository.getOne(investment.getParent().getId());
        validate(dto, parent.getInvestmentType());

        Investment subtractInvestment = dto.getSubtractInvestment();
        String description = getParentDescription(investment, investmentType, parent, subtractInvestment);
        BigDecimal amount = subtractInvestment.getAmount().multiply(BigDecimal.valueOf(-1));

        subtractInvestment.setDescription(description);
        subtractInvestment.setAmount(amount);
        subtractInvestment.setCode(generateCode());
        repository.save(subtractInvestment);
    }

    private String getParentDescription(Investment investment, InvestmentType investmentType, Investment parent, Investment subtractInvestment) {
        return "تهاتر " +
                thousandFormat(subtractInvestment.getAmount()) +
                " " +
                parent.getInvestmentType().getName() +
                " بعد از خرید " +
                thousandFormat(investment.getAmount()) +
                " " +
                investmentType.getName();
    }

    public List<VwInvestment> getByUser(Long userId) {
        return getByUserAndCode(userId, null);
    }

    public List<InvestmentReport> reportDetails(Long userId) {
        List<Investment> investments;
        if (userId != null)
            investments = repository.findByUserId(userId);
        else investments = repository.findAll();

        Map<User, Map<InvestmentType, List<Investment>>> map = investments.stream().collect(
                Collectors.groupingBy(Investment::getUser,
                        Collectors.groupingBy(Investment::getInvestmentType)));

        return map.entrySet().stream()
                .map(entry -> {
                    List<CoinInfo> infos = entry.getValue().entrySet().stream()
                            .map(e -> {
                                BigDecimal sum = e.getValue().stream()
                                        .map(Investment::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                                return new CoinInfo(e.getKey(), sum);
                            })
                            .collect(Collectors.toList());

                    return new InvestmentReport(entry.getKey(), infos);
                })
                .collect(Collectors.toList());
    }

    public List<CoinInfo> reportSummaries() {
        List<Investment> investments = repository.findAll();
        return investments.stream().collect(Collectors.groupingBy(Investment::getInvestmentType))
                .entrySet().stream()
                .map(entry -> {
                    BigDecimal sum = entry.getValue().stream()
                            .map(Investment::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new CoinInfo(entry.getKey(), sum);
                })
                .sorted(Comparator.comparing(CoinInfo::getAmount).reversed())
                .collect(Collectors.toList());
    }

    public List<Investment> getDetails(Long userId, Long typeId) {
        Specification<Investment> specification = (root, query, criteriaBuilder) -> {
            Predicate predicate = null;
            if (userId != null && typeId != null) {
                predicate = criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("user"), userId),
                        criteriaBuilder.equal(root.get("investmentType"), typeId)
                );
            } else if (userId != null) {
                predicate = criteriaBuilder.equal(root.get("user"), userId);
            } else if (typeId != null) {
                predicate = criteriaBuilder.equal(root.get("investmentType"), typeId);
            }
            return predicate;
        };
        return repository.findAll(specification, Sort.by(Sort.Direction.ASC, "shamsiDate"));
    }

    public List<CoinInfo> totalAssets(Long userId) {
        List<InvestmentReport> reports = reportDetails(userId);
        List<InvestmentType> types = typeRepository.findAll();

        Map<String, InvestmentType> typeCode = types.stream().collect(Collectors.toMap(InvestmentType::getCode, type -> type));

        BiFunction<InvestmentType, BigDecimal, BigDecimal> currentValue = (type, defaultValue) -> {
            if (type.getId().equals(typeCode.get("SETTLEMENT").getId()))
                return BigDecimal.ZERO;
            else if (type.getId().equals(typeCode.get("RIAL").getId()))
                return BigDecimal.ZERO;
            else if (type.getId().equals(typeCode.get("USDT").getId())) {
                return defaultValue;
            } else {
                InvestmentType investmentType = typeCode.get(type.getCode());
                return investmentType.getLatestPrice().multiply(defaultValue);
            }
        };
//
        List<CoinInfo> infos = new ArrayList<>();
        if (!reports.isEmpty()) {
            InvestmentReport investmentReport = reports.get(0);
            BigDecimal totalUSDT = investmentReport.getCoins().stream()
                    .map(p -> currentValue.apply(p.getInvestmentType(), p.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);


            BigDecimal totalToman = totalUSDT.multiply(typeCode.get("USDT").getLatestPrice())
                    .add(investmentReport.getCoins().stream()
                            .filter(p -> p.getInvestmentType().getId() == 1L)
                            .findFirst()
                            .map(CoinInfo::getAmount)
                            .orElse(BigDecimal.ZERO));

            infos.add(new CoinInfo(new InvestmentType(99L, "سرمایه اولیه تومان"), repository.getTotalRialInvestments(investmentReport.getUser().getId())));
            infos.add(new CoinInfo(typeCode.get("USDT"), totalUSDT));
            infos.add(new CoinInfo(typeCode.get("RIAL"), totalToman));
        }


        return infos;
    }

    public List<Investment> getDetailsByUser(Long userId) {
        return getDetails(userId, null);
    }

    public List<Investment> getDetailsByType(Long typeId) {
        return getDetails(null, typeId);
    }

    public List<AssetSummaryDto> asset_summary() {
        final InvestmentType usdt = typeRepository.findByCode("USDT");
        final Map<String, BigDecimal> map = assetSummaryRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(InvestmentSummary::getInvestmentType))
                .entrySet().stream()
                .collect(Collectors.toMap(p -> p.getKey().getCode(), entry -> {
                    final InvestmentType investmentType = entry.getKey();
                    BigDecimal latestPrice = investmentType.getLatestPrice();

                    final BigDecimal amount = entry.getValue().stream()
                            .map(InvestmentSummary::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);


                    if (investmentType.getCode().equals("SETTLEMENT")
                            || investmentType.getCode().equals("RIAL")
                            || investmentType.getCode().equals("USDT")) {
                        latestPrice = BigDecimal.ONE;
                    }
                    return amount.multiply(latestPrice);
                }));


        final BigDecimal totalDolor = map.entrySet().stream()
                .filter(entry -> !entry.getKey().equals("RIAL") && !entry.getKey().equals("SETTLEMENT"))
                .map(Map.Entry::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Arrays.asList(
                new AssetSummaryDto("سرمایه اولیه", map.get("RIAL")),
                new AssetSummaryDto("کل سرمایه به دلار", totalDolor),
                new AssetSummaryDto(" کل سرمایه تومان", totalDolor.multiply(usdt.getLatestPrice()).divide(BigDecimal.TEN, BigDecimal.ROUND_FLOOR)),
                new AssetSummaryDto("مبلغ تسویه شده", map.get("SETTLEMENT")));
    }
}