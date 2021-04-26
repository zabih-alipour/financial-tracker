package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.views.PaymentSearch;
import com.alipour.product.financialtracker.utils.GenericSpecification;
import com.alipour.product.financialtracker.utils.SearchCriteria;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class PaymentSearchSpecification implements GenericSpecification<PaymentSearch> {
    private final SearchCriteria.Search search;

    public PaymentSearchSpecification(SearchCriteria.Search search) {
        this.search = search;
    }

    @Override
    public Predicate toPredicate(Root<PaymentSearch> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = null;
        switch (search.getKey()) {
            case "user":
                predicate = criteriaBuilder.equal(root.get("user").get("id"), search.getValue());
                break;
            case "paymentType":
                predicate = criteriaBuilder.equal(root.get("paymentType").get("id"), search.getValue());
                break;
            case "paymentAmount":
                predicate = criteriaBuilder.equal(root.get("paymentAmount"), search.getValue());
                break;
            case "settlementAmount":
                predicate = criteriaBuilder.equal(root.get("settlementAmount"), search.getValue());
                break;
            case "shamsiDate":
                predicate = criteriaBuilder.like(root.get("shamsiDate"), search.getValue() + "%");
                break;
           case "settled":
                predicate = criteriaBuilder.equal(root.get("settled"), Boolean.TRUE.toString());
                break;
        }
        return predicate;
    }
}