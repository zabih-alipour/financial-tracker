package com.alipour.product.financialtracker.investment_type.service;

import com.alipour.product.financialtracker.common.CRUDService;
import com.alipour.product.financialtracker.investment_type.dto.InvestmentUserSummary;
import com.alipour.product.financialtracker.investment_type.dto.UserInvestmentTypeSummary;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeRepository;
import com.alipour.product.financialtracker.utils.SearchCriteria;
import com.alipour.product.financialtracker.utils.SpecificationBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service：
 *
 * @author Alipour
 * @date 2021-02-18 22:49:08
 */
@Service
@Transactional
public class InvestmentTypeService extends CRUDService<InvestmentType> {

    private final InvestmentTypeRepository repository;

    public InvestmentTypeService(InvestmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    protected JpaRepository<InvestmentType, Long> getRepository() {
        return repository;
    }

    public Page<InvestmentType> search(SearchCriteria searchCriteria) {
        searchCriteria = Optional.ofNullable(searchCriteria).orElse(new SearchCriteria());
        searchCriteria.getSort().setField("displayOrder");
        searchCriteria.getSort().setOrder("DESC");

        searchCriteria.getPagination().setPageSize(10);

        SpecificationBuilder<InvestmentType> specificationBuilder = new SpecificationBuilder<>(searchCriteria, InvestmentType.class);
        final PageRequest pageable = specificationBuilder.pageRequest();
        return repository.findAll(specificationBuilder.specification(), pageable);
    }

    public List<InvestmentUserSummary> typePerUserSummary(Long typeId) {
        return repository.typePerUserSummary(typeId);
    }

    public List<UserInvestmentTypeSummary> userPerTypeSummary(Long userId) {
        return repository.userPerTypeSummary(userId);
    }
}