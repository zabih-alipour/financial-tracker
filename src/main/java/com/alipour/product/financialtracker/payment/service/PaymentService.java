package com.alipour.product.financialtracker.payment.service;

import com.alipour.product.financialtracker.common.BadRequestException;
import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.common.DateUtils;
import com.alipour.product.financialtracker.payment.dtos.PaymentReportDto;
import com.alipour.product.financialtracker.payment.dtos.PaymentSettlementDto;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentReportRepository;
import com.alipour.product.financialtracker.payment.repository.PaymentRepository;
import com.alipour.product.financialtracker.payment.repository.PaymentSearchRepository;
import com.alipour.product.financialtracker.payment.views.PaymentReport;
import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import com.alipour.product.financialtracker.user.models.User;
import com.alipour.product.financialtracker.user.repositories.UserRepository;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import com.alipour.product.financialtracker.utils.SpecificationBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

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

    public PaymentService(PaymentRepository repository, PaymentReportRepository reportRepository, PaymentSearchRepository searchRepository, UserRepository userRepository) {
        this.repository = repository;
        this.reportRepository = reportRepository;
        this.searchRepository = searchRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Payment> findAll() {
        return repository.findAll(Sort.by(Sort.Order.desc("shamsiDate")));
    }

    @Override
    public Payment add(Payment payment) {
        payment.setCode(Math.abs(UUID.randomUUID().getMostSignificantBits()));
        if (payment.getShamsiDate() == null || payment.getShamsiDate().isEmpty())
            payment.setShamsiDate(DateUtils.getTodayJalali());
        return super.add(payment);
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