package com.alipour.product.financialtracker.investment.repository;

import com.alipour.product.financialtracker.investment.views.VwInvestment;
import com.alipour.product.financialtracker.utils.GenericSpecification;
import com.alipour.product.financialtracker.utils.SearchCriteria;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class VwInvestmentSpecification implements GenericSpecification<VwInvestment> {
    private final SearchCriteria.Search search;

    public VwInvestmentSpecification(SearchCriteria.Search search) {
        this.search = search;
    }

    @Override
    public Predicate toPredicate(Root<VwInvestment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = null;
        switch (search.getKey()) {
            case "user":
                predicate = criteriaBuilder.equal(root.get("user").get("id"), search.getValue());
                break;
            case "investmentType":
                predicate = criteriaBuilder.equal(root.get("investmentType").get("id"), search.getValue());
                break;
            case "amount":
                predicate = criteriaBuilder.equal(root.get("amount"), search.getValue());
                break;
            case "shamsiDate":
                predicate = criteriaBuilder.like(root.get("shamsiDate"), search.getValue() + "%");
                break;
        }
        return predicate;

    }
}
