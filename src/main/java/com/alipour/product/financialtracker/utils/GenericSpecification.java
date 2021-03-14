package com.alipour.product.financialtracker.utils;

import com.alipour.product.financialtracker.common.ParentEntity;
import org.springframework.data.jpa.domain.Specification;

public interface GenericSpecification<T extends ParentEntity> extends Specification<T> {
}
