package com.alipour.product.financialtracker.investment_type.repository;

import com.alipour.product.financialtracker.investment_type.models.InvestmentType;
import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.utils.GenericSpecification;
import com.alipour.product.financialtracker.utils.SearchCriteria;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class InvestmentTypeSpecification implements GenericSpecification<InvestmentType> {
    private final SearchCriteria.Search search;

    public InvestmentTypeSpecification(SearchCriteria.Search search) {
        this.search = search;
    }

    @Override
    public Predicate toPredicate(Root<InvestmentType> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = null;
        switch (search.getKey()) {
            case "id":
                predicate = criteriaBuilder.equal(root.get("id"), search.getValue());
                break;
            case "code":
                predicate = criteriaBuilder.like(root.get("code"), "%" + search.getValue() + "%");
                break;
            case "name":
                predicate =
                        criteriaBuilder.or(
                                criteriaBuilder.like(root.get("name"), "%" + search.getValue() + "%"),
                                criteriaBuilder.like(root.get("code"), "%" + search.getValue() + "%"));
                break;
            case "latestPrice":
                predicate = criteriaBuilder.equal(root.get("latestPrice"), search.getValue());
                break;
            case "displayOrder":
                predicate = criteriaBuilder.equal(root.get("displayOrder"), search.getValue());
                break;
        }
        return predicate;
    }
}
