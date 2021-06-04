package com.alipour.product.financialtracker.payment.service;

import com.alipour.product.financialtracker.common.BadRequestException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.DateUtils;
import com.alipour.product.financialtracker.investment.dto.CoinInfo;
import com.alipour.product.financialtracker.investment.dto.InvestmentDto;
import com.alipour.product.financialtracker.investment.service.InvestmentService;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.payment.dtos.PaymentReportDto;
import com.alipour.product.financialtracker.payment.dtos.PaymentSettlementDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentReportRepository;
import com.alipour.product.financialtracker.payment.repository.PaymentRepository;
import com.alipour.product.financialtracker.payment.repository.PaymentSearchRepository;
import com.alipour.product.financialtracker.payment.views.PaymentReport;
import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import com.alipour.product.financialtracker.payment_type.repository.PaymentTypeRepository;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.repositories.UserRepository;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import com.alipour.product.financialtracker.utils.SpecificationBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.alipour.product.financialtracker.utils.Utils.generateCode;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 16:41:23
 */
@Service
public class PaymentService extends CRUDService<Payment> {

    private final PaymentRepository repository;
    private final PaymentReportRepository reportRepository;
    private final PaymentSearchRepository searchRepository;
    private final UserRepository userRepository;
    private final PaymentTypeRepository paymentTypeRepository;
    private final InvestmentService investmentService;

    public PaymentService(PaymentRepository repository, PaymentReportRepository reportRepository, PaymentSearchRepository searchRepository, UserRepository userRepository, PaymentTypeRepository paymentTypeRepository, InvestmentService investmentService) {
        this.repository = repository;
        this.reportRepository = reportRepository;
        this.searchRepository = searchRepository;
        this.userRepository = userRepository;
        this.paymentTypeRepository = paymentTypeRepository;
        this.investmentService = investmentService;
    }

    @Override
    public List<Payment> findAll() {
        return repository.findAll(Sort.by(Sort.Order.desc("shamsiDate")));
    }

    @Override
    public Payment add(Payment payment) {
        payment.setCode(Long.valueOf(generateCode()));
        if (payment.getShamsiDate() == null || payment.getShamsiDate().isEmpty())
            payment.setShamsiDate(DateUtils.getTodayJalali());

        return paymentTypeRepository.findById(payment.getPaymentType().getId())
                .filter(paymentType -> paymentType.getId().equals(PaymentType.INVESTMENT.getId()))
                .map(paymentType -> {
                    final InvestmentDto investmentDto = new InvestmentDto();
                    investmentDto.setUser(payment.getUser());
                    investmentDto.setChange(new CoinInfo(InvestmentType.RIAL, payment.getAmount(), BigDecimal.ONE));
                    return investmentService.add(investmentDto);
                })
                .map(investment -> {
                    payment.setInvestmentCode(investment.getCode());
                    payment.setDescription("سرمایه گذاری");
                    return super.add(payment);
                })
                .map(p -> {
                    Payment settlement = p.settlement();
                    settlement.setAmount(settlement.getAmount().negate());
                    settlement.setParent(p);
                    settlement.setCode(Long.valueOf(generateCode()));
                    super.add(settlement);
                    return p;
                }).orElseGet(() -> super.add(payment));
    }

    @Override
    protected JpaRepository<Payment, Long> getRepository() {
        return repository;
    }

    public Payment settlement(PaymentSettlementDto dto) {
        final Payment payment = repository.getOne(dto.getId());
        Payment settlement = payment.settlement();
        if (dto.getAmount() == null) {
            dto.setAmount(payment.getAmount());
        }

        if (dto.getAmount().longValue() < 0) {
            throw new BadRequestException("مقدار وارد شده کمتر از صفر نمیتواند باشد");
        }
        if (payment.getAmount().compareTo(dto.getAmount()) < 0) {
            throw new BadRequestException("مقدار وارد شده از کل مبلغ پرداخت بیشتر میباشد");
        }
        settlement.setAmount(dto.getAmount().negate());
        settlement.setDescription(settlement.getDescription().concat(" \t ").concat(Optional.ofNullable(dto.getDescription()).orElse("")));

        return add(settlement);
    }

    public Payment settlement(Long paymentId, BigDecimal amount) {

        Payment copy = repository.getOne(paymentId).settlement();

        copy.setAmount(copy.getAmount().subtract(amount));
        return add(copy);
    }

    public PaymentReportDto reports(Long userId) {
        final PaymentReportDto reportDto = new PaymentReportDto();
        final Map<User, List<PaymentReport>> map = reportRepository.findByUserId(userId).stream()
                .collect(Collectors.groupingBy(PaymentReport::getUser));
        map.forEach((user, paymentReports) -> {
            List<PaymentReportDto.Detail> details = paymentReports.stream()
                    .map(val -> new PaymentReportDto.Detail(val.getType(), val.getAmount()))
                    .collect(Collectors.toList());

            reportDto.setUser(user);
            reportDto.setDetailsAndSum(details);
        });
        if (reportDto.getUser() == null) {
            reportDto.setUser(userRepository.getOne(userId));
        }

        return reportDto;
    }

    public List<Payment> findByUserAndType(Long userId, Long typeId) {
        return repository.findByUserAndType(userId, typeId);
    }

    public List<Payment> findByType(Long typeId) {
        return repository.findByTypeId(typeId);
    }

    public List<Payment> findByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<Payment> findByParent(Long paymentId) {
        return repository.findByParentId(paymentId);
    }

    public Page<PaymentSearch> search(SearchCriteria searchCriteria) {
        searchCriteria = Optional.ofNullable(searchCriteria).orElseGet(SearchCriteria::new);
        searchCriteria.getPagination().setPageSize(10);
        SpecificationBuilder<PaymentSearch> specificationBuilder = new SpecificationBuilder<>(searchCriteria, PaymentSearch.class);
        return searchRepository.findAll(specificationBuilder.specification(), specificationBuilder.pageRequest());
    }
}