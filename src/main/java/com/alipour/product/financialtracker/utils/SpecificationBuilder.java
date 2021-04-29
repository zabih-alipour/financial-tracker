package com.alipour.product.financialtracker.utils;

import com.alipour.product.financialtracker.common.ParentEntity;
import com.alipour.product.financialtracker.investment.repository.VwInvestmentSpecification;
import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.investment_type.repository.InvestmentTypeSpecification;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.payment.repository.PaymentSearchSpecification;
import com.alipour.product.financialtracker.payment.repository.PaymentSpecification;
import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import com.alipour.product.financialtracker.payment_type.models.PaymentType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.stream.Collectors;

public class SpecificationBuilder<T extends ParentEntity> {
    private final SearchCriteria criteria;
    private final Class<T> tclass;

    public SpecificationBuilder(SearchCriteria criteria, Class<T> tclass) {
        this.criteria = criteria;
        this.tclass = tclass;
    }

    public Specification<T> specification() {
        List<GenericSpecification<T>> specifications = criteria.getSearchArias().stream()
                .map(this::getSpecification)
                .collect(Collectors.toList());

        Specification<T> specification = null;
        if (!specifications.isEmpty()) {
            specification = specifications.get(0);
            for (int i = 1; i < specifications.size(); i++) {
                specification = specification.and(specifications.get(i));
            }
        }
        return specification;
    }

    public PageRequest pageRequest() {
        return PageRequest.of(criteria.getPagination().getPageNumber(), criteria.getPagination().getPageSize(), sort());
    }

    public Sort sort() {
        if (criteria.getSort() == null) {
            return Sort.unsorted();
        } else
            return Sort.by(criteria.getSort().getOrder().equals("ASC")
                            ? Sort.Direction.ASC
                            : Sort.Direction.DESC,
                    criteria.getSort().getField());
    }

    private GenericSpecification<T> getSpecification(SearchCriteria.Search search) {
        GenericSpecification specification = null;

        if (tclass.isAssignableFrom(Payment.class))
            specification = new PaymentSpecification(search);
        else if (tclass.isAssignableFrom(VwInvestment.class))
            specification = new VwInvestmentSpecification(search);
        else if (tclass.isAssignableFrom(PaymentSearch.class))
            specification = new PaymentSearchSpecification(search);
        else if (tclass.isAssignableFrom(InvestmentType.class))
            specification = new InvestmentTypeSpecification(search);


        return specification;
    }
}
