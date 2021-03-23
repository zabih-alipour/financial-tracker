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
        if (search.getKey().equals("user.name"))
            return criteriaBuilder.like(root.get("user").get("name"), search.getValue() + "%");
        if (search.getKey().equals("user.id"))
            return criteriaBuilder.equal(root.get("user").get("id"), search.getValue());
        else return null;
    }
}
