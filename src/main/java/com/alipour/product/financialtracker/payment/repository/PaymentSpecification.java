package com.alipour.product.financialtracker.payment.repository;

import com.alipour.product.financialtracker.payment.model.Payment;
import com.alipour.product.financialtracker.utils.GenericSpecification;
import com.alipour.product.financialtracker.utils.SearchCriteria;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class PaymentSpecification implements GenericSpecification<Payment> {
    private final SearchCriteria.Search search;

    public PaymentSpecification(SearchCriteria.Search search) {
        this.search = search;
    }

    @Override
    public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate predicate = null;
        switch (search.getKey()) {
            case "user":
                predicate = criteriaBuilder.equal(root.get("user").get("id"), search.getValue());
                break;
            case "paymentType":
                predicate = criteriaBuilder.equal(root.get("paymentType").get("id"), search.getValue());
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
